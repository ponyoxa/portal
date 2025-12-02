# OGP画像自動生成Integration

ビルド時に各ページのOGP画像を自動生成し、Cloudflare R2にアップロードします。
コンテンツハッシュベースの差分検出により、変更されたページのみ再生成します。

## セットアップ

### 1. Cloudflare R2バケットの作成

1. Cloudflareダッシュボード > R2 > バケットを作成
2. バケット名: `ogp-images` (任意)
3. バケットをパブリックアクセス可能に設定
4. カスタムドメインを設定（推奨）: `ogp.ponyoxa.com`

### 2. R2 APIトークンの取得

1. R2 > 設定 > R2 APIトークン > APIトークンを作成
2. 権限: オブジェクトの読み取りと書き込み
3. Access Key IDとSecret Access Keyをコピー

### 3. 環境変数の設定

#### ローカル開発

`.env` ファイルを作成:

```bash
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=ogp-images
R2_PUBLIC_URL=https://ogp.ponyoxa.com
```

#### Cloudflareビルド環境

Cloudflareダッシュボード > Workers & Pages > 設定 > 環境変数:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL`

## 使い方

### ビルド実行

```bash
pnpm run build
```

ビルド時に自動的に:

1. R2から既存のマニフェストを取得
2. 各ページのコンテンツハッシュを計算
3. 変更されたページのみOGP画像を生成
4. 生成した画像をR2にアップロード
5. 更新されたマニフェストをR2に保存

### 出力ログ例

```
🖼️  OGP画像生成を開始...

📥 マニフェストを取得中...
  ✨ 生成中: /blog/new-post/
  ⏭️  スキップ: /blog/old-post/
  ⏭️  スキップ: /

💾 マニフェストを保存中...

✅ OGP画像生成完了: 1件生成, 2件スキップ
```

## カスタマイズ

### OGP画像のデザイン変更

`integrations/ogp-generator/generator.js` を編集してください。

レイアウト変更後は `differ.js` の `layoutVersion` をインクリメント:

```javascript
this.layoutVersion = "v2"; // v1 → v2
```

### 全件再生成

環境変数で強制再生成:

```bash
FORCE_REGENERATE_OGP=true pnpm run build
```

または、R2のマニフェストファイルを削除:

- `ogp-manifest.json` を削除

## フォントについて

このIntegrationは日本語対応フォント（IPAゴシック）をバンドルしています。

- `fonts/NotoSansJP-Regular.ttf` (実際はIPAゴシック)
- ライセンス: IPA Font License (fonts/LICENSE.txt)
- Cloudflare Workersビルド環境でも動作します

## トラブルシューティング

### エラー: R2の環境変数が設定されていません

環境変数が正しく設定されているか確認してください。

### フォントエラー

フォントファイルが見つからない場合、`integrations/ogp-generator/fonts/` ディレクトリに
日本語対応フォント（.ttf形式）が存在するか確認してください。

### 画像が表示されない

1. R2バケットがパブリックアクセス可能か確認
2. `R2_PUBLIC_URL` が正しく設定されているか確認
3. ブラウザの開発者ツールでOGP URLを確認

## 仕組み

### 差分検出

各ページのコンテンツ（title, description, layoutVersion）からSHA-256ハッシュを生成。
R2に保存されたマニフェストと比較し、ハッシュが異なる場合のみ再生成。

### マニフェストファイル

R2の `ogp-manifest.json`:

```json
{
  "/blog/post-name/": {
    "hash": "abc123...",
    "url": "https://ogp.ponyoxa.com/ogp/blog-post-name.png",
    "updatedAt": "2025-11-17T12:00:00.000Z"
  }
}
```

### ファイル構成

```
integrations/ogp-generator/
├── index.js       # メインIntegration
├── generator.js   # Satoriを使った画像生成
├── uploader.js    # R2アップロード
├── differ.js      # 差分検出ロジック
└── README.md      # このファイル
```
