#!/bin/bash

# 今日の日付を取得 (フォーマット: YYYY-MM-DD)
today=$(date +%Y-%m-%d)

# blog か reports かを聞く
read -p "Is this a blog or a report? (Enter 'blog' or 'reports'): " type
if [[ "$type" != "blog" && "$type" != "reports" ]]; then
  echo "Invalid type. Please enter 'blog' or 'reports'."
  exit 1
fi

# タイトルと説明を入力
read -p "Enter the title: " title
read -p "Enter the description: " description

# ファイル名を決定
if [ "$type" == "blog" ]; then
  read -p "Enter the filename (without .md): " filename
  filename="${filename}.md"
else
  filename="${today}.md"
fi

# 出力先ディレクトリのパスを作成
output_dir="./content/${type}"
mkdir -p "$output_dir"

# ファイルパスの設定
file_path="${output_dir}/${filename}"

# メタデータ付きのファイル内容を作成
cat <<EOF > "$file_path"
---
title: $title
description: $description
createdAt: $today
updatedAt: $today
---
EOF

echo "File created at: $file_path"
