<template>
  <div>
    <h1>Reports</h1>
    <div v-if="data" class="report-list">
      <div v-for="report in sortedData" :key="report._path" class="report-card">
        <small>
          {{ new Date(report.createdAt).toLocaleDateString() }}
        </small>
        <NuxtLink :to="`/reports/${report._path.split('/').pop()}`">
          <p>{{ report.title }}</p>
        </NuxtLink>
      </div>
    </div>
    <br />
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
  return data.value?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
});
</script>

<style scoped>
.report-list {
  gap: 1rem;
  padding: 0 8px; /* 左右のパディングを追加してレスポンシブ対応 */
}

h2 {
  font-size: 1rem;
}

.report-card {
  max-width: 600px; /* カードの最大幅を設定 */
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
