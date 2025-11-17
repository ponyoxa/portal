import crypto from 'crypto';

/**
 * OGP画像の差分検出
 */
export class OGPDiffer {
  constructor(manifest) {
    this.manifest = manifest || {};
    // レイアウトバージョン（レイアウト変更時にインクリメント）
    this.layoutVersion = 'v2';
  }

  /**
   * 再生成が必要かチェック
   */
  needsRegeneration(pathname, content) {
    const hash = this.calculateHash(content);
    const existing = this.manifest[pathname];

    // 環境変数でフル再生成を強制
    if (process.env.FORCE_REGENERATE_OGP === 'true') {
      return { needsRegen: true, hash };
    }

    // 存在しない、またはハッシュが異なる場合は再生成
    if (!existing || existing.hash !== hash) {
      return { needsRegen: true, hash };
    }

    // ハッシュが同じ場合はスキップ
    return {
      needsRegen: false,
      hash,
      existingUrl: existing.url,
    };
  }

  /**
   * コンテンツのハッシュを計算
   */
  calculateHash(content) {
    const data = JSON.stringify({
      title: content.title || '',
      description: content.description || '',
      layoutVersion: this.layoutVersion,
    });

    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex')
      .substring(0, 16); // 短縮版
  }

  /**
   * マニフェストを更新
   */
  updateManifest(pathname, hash, url) {
    this.manifest[pathname] = {
      hash,
      url,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * 現在のマニフェストを取得
   */
  getManifest() {
    return this.manifest;
  }
}
