<template>
  <div>
    <h1>Reports</h1>
    <div v-if="data">
      <div v-for="report in data" :key="report._path">
        <NuxtLink :to="`/reports/${report._path.split('/').pop()}`">{{ report.title }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data } = await useAsyncData('reportsData', async () => {
  const content = await queryContent('reports').find();
  return content;
});
</script>
