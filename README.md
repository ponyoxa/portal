# Content v2 Minimal Starter

Look at the [Content documentation](https://content.nuxt.com/) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## タグ管理

### 現在使用されているタグの一覧を確認

```bash
grep -h "^tags:" src/content/blog/*.md src/content/blog/*.mdx 2>/dev/null | sed 's/tags: \[//; s/\]//; s/"//g' | tr ',' '\n' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//' | sort -u
```
