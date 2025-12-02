# ponyoxa portal

## タグ管理

### 現在使用されているタグの一覧を確認

```bash
grep -h "^tags:" src/content/blog/*.md src/content/blog/*.mdx 2>/dev/null | sed 's/tags: \[//; s/\]//; s/"//g' | tr ',' '\n' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//' | sort -u
```
