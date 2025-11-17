import { getCollection } from 'astro:content';
import { OGPGenerator } from './generator.js';
import { R2Uploader } from './uploader.js';
import { OGPDiffer } from './differ.js';
import { writeFile } from 'fs/promises';
import path from 'path';

/**
 * OGP画像生成 Astro Integration
 */
export default function ogpGeneratorIntegration() {
  return {
    name: 'ogp-generator',
    hooks: {
      'astro:build:done': async ({ dir, pages }) => {
        console.log('\n🖼️  OGP画像生成を開始...\n');

        // 環境変数チェック
        if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID) {
          console.log('⚠️  R2環境変数が設定されていないため、OGP画像生成をスキップします');
          return;
        }

        try {
          const uploader = new R2Uploader();
          const generator = new OGPGenerator();

          // 1. R2から既存のマニフェストを取得
          console.log('📥 マニフェストを取得中...');
          const manifest = await uploader.getManifest();
          const differ = new OGPDiffer(manifest);

          // 2. コンテンツコレクションを取得
          const blogPosts = await getCollection('blog');
          const diaries = await getCollection('diaries');
          const rootPages = await getCollection('root');

          const allContent = [
            ...blogPosts.map(p => ({
              pathname: `/blog/${p.slug}/`,
              title: p.data.title,
              description: p.data.description,
            })),
            ...diaries.map(p => ({
              pathname: `/diaries/${p.slug}/`,
              title: p.data.title,
              description: p.data.description,
            })),
            ...rootPages.map(p => ({
              pathname: p.slug === 'index' ? '/' : `/${p.slug}/`,
              title: p.data.title,
              description: p.data.description,
            })),
          ];

          let generated = 0;
          let skipped = 0;
          const urlMap = {};

          // 3. 各ページをチェックして必要なら生成
          for (const content of allContent) {
            const { needsRegen, hash, existingUrl } = differ.needsRegeneration(
              content.pathname,
              content
            );

            if (needsRegen) {
              console.log(`  ✨ 生成中: ${content.pathname}`);
              const imageBuffer = await generator.generate(content);
              const url = await uploader.upload(content.pathname, imageBuffer);

              differ.updateManifest(content.pathname, hash, url);
              urlMap[content.pathname] = url;
              generated++;
            } else {
              console.log(`  ⏭️  スキップ: ${content.pathname}`);
              urlMap[content.pathname] = existingUrl;
              skipped++;
            }
          }

          // 4. マニフェストをR2に保存
          if (generated > 0) {
            console.log('\n💾 マニフェストを保存中...');
            await uploader.saveManifest(differ.getManifest());
          }

          // 5. ビルド成果物にURLマップを出力
          const urlMapPath = path.join(dir.pathname, 'ogp-urls.json');
          await writeFile(urlMapPath, JSON.stringify(urlMap, null, 2));

          console.log(`\n✅ OGP画像生成完了: ${generated}件生成, ${skipped}件スキップ\n`);
        } catch (error) {
          console.error('❌ OGP画像生成エラー:', error);
          // ビルドは失敗させない
        }
      },
    },
  };
}
