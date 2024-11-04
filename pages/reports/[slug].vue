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
</template>


