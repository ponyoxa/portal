<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const { data: report } = await useAsyncData(`report-${route.params.slug}`, async () => {
  const report = await queryContent('reports', route.params.slug).findOne();
  return report;
});
</script>

<template>
  <div>
    <h1>{{ report.title }}</h1>
    <ContentRenderer :value="report" />
  </div>
  <a class="link-to-top" href="/reports">一覧に戻る</a>
</template>

<style>
.link-to-top {
  text-align: right;
  display: block;
}
</style>