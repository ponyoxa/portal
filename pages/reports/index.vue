<template>
  <div>
    <h1>Reports</h1>
    <div v-if="data" class="report-list">
      <div
        v-for="report in sortedData"
        :key="report._path"
        class="report-card"
      >
        <NuxtLink :to="`/reports/${report._path.split('/').pop()}`">
          <h2>{{ report.title }}</h2>
        </NuxtLink>
        <p class="report-description">{{ report.description }}</p>
        <div class="report-meta">
          <small>作成日: {{ new Date(report.createdAt).toLocaleDateString() }}</small><br />
          <small>更新日: {{ new Date(report.updatedAt).toLocaleDateString() }}</small>
        </div>
      </div>
    </div>
    <br>
    <a class="link-to-top" href="/">トップに戻る</a>
  </div>
</template>

<script setup>
const { data } = await useAsyncData('reportsData', async () => {
  const content = await queryContent('reports').find();
  return content;
});

// 日付の新しい順に並び替え
const sortedData = computed(() => {
  return data.value?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});
</script>

<style scoped>
.report-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 16px; /* 左右のパディングを追加してレスポンシブ対応 */
}

.report-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  max-width: 600px; /* カードの最大幅を設定 */
  transition: box-shadow 0.2s ease;
}

.report-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.report-description {
  color: #666;
  margin: 0.5rem 0;
}

.report-meta {
  font-size: 0.8rem;
  color: #999;
}

.link-to-top {
  text-align: right;
  display: block;
  padding: 1rem;
}

/* レスポンシブデザイン用のメディアクエリ */
@media (max-width: 768px) {
  .report-card {
    max-width: 100%; /* カード幅を画面幅に合わせる */
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .report-card {
    padding: 0.8rem; /* モバイルでのパディング調整 */
  }

  .link-to-top {
    text-align: center; /* 小さい画面では中央揃え */
  }
}
</style>
