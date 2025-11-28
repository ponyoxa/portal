#!/bin/bash

set -e

# 引数チェック
if [ $# -eq 0 ]; then
    echo "使い方: $0 <画像ファイルパス>" >&2
    echo "例: $0 ./screenshot.png" >&2
    exit 1
fi

IMAGE_PATH="$1"

# ファイルの存在確認
if [ ! -f "$IMAGE_PATH" ]; then
    echo "エラー: ファイルが見つかりません: $IMAGE_PATH" >&2
    exit 1
fi

# .envファイルを読み込む
if [ ! -f .env ]; then
    echo "エラー: .envファイルが見つかりません" >&2
    exit 1
fi

# .envから環境変数を読み込み
export $(grep -v '^#' .env | xargs)

# 必要な環境変数をチェック
if [ -z "$R2_BUCKET_NAME" ] || [ -z "$R2_PUBLIC_URL" ]; then
    echo "エラー: .envファイルにR2_BUCKET_NAMEとR2_PUBLIC_URLを設定してください" >&2
    exit 1
fi

# ファイルのMD5ハッシュを計算
if command -v md5sum &> /dev/null; then
    HASH=$(md5sum "$IMAGE_PATH" | cut -d' ' -f1)
elif command -v md5 &> /dev/null; then
    HASH=$(md5 -q "$IMAGE_PATH")
else
    echo "エラー: md5sumまたはmd5コマンドが見つかりません" >&2
    exit 1
fi

# ファイル名と拡張子を取得
FILENAME=$(basename "$IMAGE_PATH")
EXT="${FILENAME##*.}"

# R2のキーを生成（ハッシュベース）
R2_KEY="blog-images/${HASH}.${EXT}"
R2_PATH="${R2_BUCKET_NAME}/${R2_KEY}"
PUBLIC_URL="${R2_PUBLIC_URL}/${R2_KEY}"

# Content-Typeを設定
case "${EXT,,}" in
    png) CONTENT_TYPE="image/png" ;;
    jpg|jpeg) CONTENT_TYPE="image/jpeg" ;;
    gif) CONTENT_TYPE="image/gif" ;;
    webp) CONTENT_TYPE="image/webp" ;;
    svg) CONTENT_TYPE="image/svg+xml" ;;
    *) CONTENT_TYPE="application/octet-stream" ;;
esac

# R2にアップロード
pnpm exec wrangler r2 object put "$R2_PATH" \
    --file="$IMAGE_PATH" \
    --content-type="$CONTENT_TYPE" \
    --cache-control="public, max-age=31536000, immutable" \
    >&2

# 公開URLを出力（stdoutに出力するのはこれだけ）
echo "$PUBLIC_URL"
