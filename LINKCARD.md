# リンクカード機能の使い方

マークダウン記事内でリンクをカード形式で表示できます。

## 基本的な使い方

### 1. ファイルを `.mdx` 形式にする

通常の `.md` ファイルを `.mdx` に変更します。

```bash
# 例
mv src/content/blog/my-post.md src/content/blog/my-post.mdx
```

### 2. LinkCard コンポーネントをインポート

ファイルの frontmatter の後に、以下を追加します：

```mdx
---
title: 記事のタイトル
---

import LinkCard from '../../components/LinkCard.astro';

記事の内容...
```

### 3. リンクカードを表示

`<LinkCard>` コンポーネントを使ってリンクをカード形式で表示します：

```mdx
<LinkCard url="https://example.com" />
```

## 使用例

### 外部リンクの場合

```mdx
---
title: おすすめのサイト
---

import LinkCard from '../../components/LinkCard.astro';

このサイトがおすすめです：

<LinkCard url="https://github.com" />

上記のリンクは OGP 情報（タイトル、説明、サムネイル）を自動取得してカード表示します。
```

### 内部リンクの場合

```mdx
<LinkCard url="/blog" />
```

内部リンクの場合は、シンプルなカード形式で表示されます。

### 通常のリンクと併用

```mdx
これは通常の[インラインリンク](/path)です。

<LinkCard url="https://example.com" />

カード形式にしたいリンクだけ `<LinkCard>` を使い、
文中のリンクは通常の Markdown 記法を使います。
```

## 機能

- **自動 OGP 取得**: 外部リンクの場合、ビルド時に自動で OGP 情報を取得
- **キャッシュ機能**: 同じ URL の重複取得を防止
- **レスポンシブ対応**: PC とモバイルで最適な表示
- **ホバーエフェクト**: マウスオーバー時のアニメーション
- **フォールバック**: OGP がない場合も適切に表示

## 注意事項

- MDX ファイル (`.mdx`) でのみ使用可能です
- ビルド時に外部 URL にアクセスするため、初回ビルドは少し時間がかかります
- OGP 取得に失敗した場合は、URL がタイトルとして表示されます
