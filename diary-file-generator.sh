#!/bin/bash

# 今日の日付を取得 (フォーマット: YYYY-MM-DD)
today=$(date +%Y-%m-%d)

filename="${today}.md"

# 出力先ディレクトリのパスを作成
output_dir="./content/diaries"

# ファイルパスの設定
file_path="${output_dir}/${filename}"

# メタデータ付きのファイル内容を作成
cat <<EOF > "$file_path"
---
title: 
description: 
createdAt: $today
updatedAt: $today
---
EOF

echo "File created at: $file_path"