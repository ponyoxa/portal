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
}

.report-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  width: 600px; /* カードの幅を調整して中央に配置 */
  margin: 0 auto;   /* カードを中央揃え */
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
}
</style>
