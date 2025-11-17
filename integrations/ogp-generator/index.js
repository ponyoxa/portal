import { OGPGenerator } from './generator.js';
import { R2Uploader } from './uploader.js';
import { OGPDiffer } from './differ.js';
import { writeFile, readFile, readdir } from 'fs/promises';
import { join } from 'path';

/**
 * フロントマターをパース
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      frontmatter[key.trim()] = valueParts.join(':').trim();
    }
  }

  return frontmatter;
}

/**
 * マークダウンファイルからコンテンツを取得
 */
async function getContentFromFiles() {
  const allContent = [];

  // ブログ記事
  try {
    const blogDir = 'src/content/blog';
    const blogFiles = await readdir(blogDir);

    for (const file of blogFiles.filter(f => f.endsWith('.md'))) {
      const content = await readFile(join(blogDir, file), 'utf-8');
      const frontmatter = parseFrontmatter(content);
      const slug = file.replace('.md', '');

      allContent.push({
        pathname: `/blog/${slug}/`,
        title: frontmatter.title || slug,
        description: frontmatter.description || '',
      });
    }
  } catch (e) {
    console.log('⚠️  ブログディレクトリが見つかりません');
  }

  // 日記
  try {
    const diaryDir = 'src/content/diaries';
    const diaryFiles = await readdir(diaryDir);

    for (const file of diaryFiles.filter(f => f.endsWith('.md'))) {
      const content = await readFile(join(diaryDir, file), 'utf-8');
      const frontmatter = parseFrontmatter(content);
      const slug = file.replace('.md', '');

      allContent.push({
        pathname: `/diaries/${slug}/`,
        title: frontmatter.title || slug,
        description: frontmatter.description || '',
      });
    }
  } catch (e) {
    console.log('⚠️  日記ディレクトリが見つかりません');
  }

  // Rootページ
  try {
    const rootDir = 'src/content/root';
    const rootFiles = await readdir(rootDir);

    for (const file of rootFiles.filter(f => f.endsWith('.md'))) {
      const content = await readFile(join(rootDir, file), 'utf-8');
      const frontmatter = parseFrontmatter(content);
      const slug = file.replace('.md', '');

      allContent.push({
        pathname: slug === 'index' ? '/' : `/${slug}/`,
        title: frontmatter.title || 'ponyoxa portal',
        description: frontmatter.description || '',
      });
    }
  } catch (e) {
    console.log('⚠️  Rootディレクトリが見つかりません');
  }

  return allContent;
}

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

          // 2. マークダウンファイルから直接コンテンツを取得
          const allContent = await getContentFromFiles();

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
          const urlMapPath = join(dir.pathname, 'ogp-urls.json');
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
