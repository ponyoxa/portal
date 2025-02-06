<template>
  <div>
    <h1>Blog</h1>
    <div v-if="data" class="article-list">
      <div
        v-for="article in sortedData"
        :key="article._path"
        class="article-card"
      >
      <small
            >
            {{ new Date(article.createdAt).toLocaleDateString() }}</small
          >
        <NuxtLink :to="`/blog/${article._path.split('/').pop()}`">
          <h2>{{ article.title }}</h2>
        </NuxtLink>
        <div class="article-meta">
          
        </div>
      </div>
    </div>
    <br />
    <a class="link-to-top" href="/">トップに戻る</a>
  </div>
</template>

<script setup>
const { data } = await useAsyncData('blogData', async () => {
  const content = await queryContent('blog').find();
  return content;
});

// 日付の新しい順に並び替え
const sortedData = computed(() => {
  return data.value?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
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
  padding: 1rem;
  max-width: 600px; /* カードの最大幅を設定 */
}

.article-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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