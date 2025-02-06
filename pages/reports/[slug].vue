<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const { data: report, error } = await useAsyncData(`report-${route.params.slug}`, async () => {
  const report = await queryContent('reports', route.params.slug).findOne();
  if (!report) {
    throw new Error('Document not found');
  }
  return report;
});
</script>

<template>
  <div>
    <template v-if="error">
      <h1>Document not found</h1>
    </template>
    <template v-else>
      <h1>{{ report.title }}</h1>
      <ContentRenderer :value="report" />
      <a class="link-to-top" href="/reports">一覧に戻る</a>
    </template>
  </div>
</template>

<style>
.link-to-top {
  text-align: right;
  display: block;
}
li, ul {
  padding-top: 4px;/*リスト上の余白*/
  padding-bottom: 4px;/*リスト下の余白*/
}
</style>