<template>
  <div>
    <h1>Blog</h1>
    <div v-if="blogs?.length" class="blog-list">
      <div v-for="post in blogs" :key="post.path" class="blog-card">
        <small>
          {{ post.createdAt }}
        </small>
        <NuxtLink :to="post.path">
          <p>{{ post.title ?? "(no title)" }}</p>
        </NuxtLink>
      </div>
    </div>

    <div v-else>記事がありません</div>
    <br />
    <a class="link-to-top" href="/">トップに戻る</a>
  </div>
</template>

<script setup>
const { data: blogs } = await useAsyncData("blog-list", async () => {
  const content = await queryCollection("blog")
    .select("path", "title", "createdAt")
    .order("createdAt", "DESC")
    .all();
  return content;
});
</script>
<style scoped>
.article-list {
  gap: 1rem;
  padding: 0 8px; /* 左右のパディングを追加してレスポンシブ対応 */
}

h2 {
  font-size: 1rem;
}

.article-card {
  max-width: 600px; /* カードの最大幅を設定 */
}

.link-to-top {
  text-align: right;
  display: block;
  padding: 1rem;
}

/* レスポンシブデザイン用のメディアクエリ */
@media (max-width: 768px) {
  .article-card {
    max-width: 100%; /* カード幅を画面幅に合わせる */
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .article-card {
    padding: 0.8rem; /* モバイルでのパディング調整 */
  }

  .link-to-top {
    text-align: center; /* 小さい画面では中央揃え */
  }
}
</style>
