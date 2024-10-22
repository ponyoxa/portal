<template>
  <div>
    <h1>Blog</h1>
    <div v-if="data">
      <div v-for="article in data" :key="article._path">
        <NuxtLink :to="`/blog/${article._path.split('/').pop()}`">{{ article.title }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data } = await useAsyncData('blogData', async () => {
  const content = await queryContent('blog').find();
  return content;
});
</script>
