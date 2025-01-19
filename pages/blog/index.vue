<template>
  <div>
    <h1>Blog</h1>
    <div v-if="data" class="article-list">
      <div
        v-for="article in sortedData"
        :key="article._path"
        class="article-card"
      >
        <NuxtLink :to="`/blog/${article._path.split('/').pop()}`">
          <h2>{{ article.title }}</h2>
        </NuxtLink>
        <div class="article-meta">
          <small>公開日: {{ new Date(article.createdAt).toLocaleDateString() }}</small><br />
          <small>更新日: {{ new Date(article.updatedAt).toLocaleDateString() }}</small>
        </div>
      </div>
    </div>
    <br>
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
  return data.value?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});
</script>
<style scoped>
.article-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 16px; /* 左右のパディングでレスポンシブ対応 */
}

.article-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 600px;
  padding: 1rem;
  transition: box-shadow 0.2s ease;
}

.article-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.article-description {
  color: #666;
  margin: 0.5rem 0;
}

.article-meta {
  font-size: 0.8rem;
  color: #999;
}

.link-to-top {
  text-align: right;
  display: block;
  padding: 1rem;
}

/* レスポンシブスタイル */
@media (max-width: 768px) {
  .article-card {
    max-width: 100%; /* 幅を100%にしてカードを画面幅に合わせる */
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem; /* 見出しのサイズを調整 */
  }
}

@media (max-width: 480px) {
  .article-card {
    padding: 0.8rem;
  }

  .link-to-top {
    text-align: center; /* 小さな画面で中央揃え */
  }
}
</style>