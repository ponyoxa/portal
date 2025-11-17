import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

/**
 * R2へのアップロード処理
 */
export class R2Uploader {
  constructor() {
    this.client = this.createClient();
    this.bucketName = process.env.R2_BUCKET_NAME;
    this.publicUrl = process.env.R2_PUBLIC_URL;
  }

  createClient() {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error('R2の環境変数が設定されていません');
    }

    return new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  /**
   * 画像をR2にアップロード
   */
  async upload(pathname, imageBuffer) {
    // パスから安全なファイル名を生成
    const key = this.pathnameToKey(pathname);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: imageBuffer,
      ContentType: 'image/png',
      CacheControl: 'public, max-age=31536000, immutable',
    });

    await this.client.send(command);

    // 公開URLを返す
    return `${this.publicUrl}/${key}`;
  }

  /**
   * マニフェストを取得
   */
  async getManifest() {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: 'ogp-manifest.json',
      });

      const response = await this.client.send(command);
      const body = await response.Body.transformToString();
      return JSON.parse(body);
    } catch (error) {
      if (error.name === 'NoSuchKey') {
        console.log('📝 マニフェストが存在しないため、新規作成します');
        return {};
      }
      throw error;
    }
  }

  /**
   * マニフェストを保存
   */
  async saveManifest(manifest) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: 'ogp-manifest.json',
      Body: JSON.stringify(manifest, null, 2),
      ContentType: 'application/json',
    });

    await this.client.send(command);
  }

  /**
   * パス名をR2のキーに変換
   */
  pathnameToKey(pathname) {
    // /blog/post-name/ -> ogp/blog/post-name.png
    const normalized = pathname
      .replace(/^\//, '')
      .replace(/\/$/, '')
      .replace(/\//g, '-');

    return `ogp/${normalized || 'index'}.png`;
  }
}
