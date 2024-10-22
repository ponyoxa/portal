<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const { data: article } = await useAsyncData(`blog-article-${route.params.slug}`, async () => {
  const content = await queryContent('blog', route.params.slug).findOne();
  return content;
});
</script>

<template>
  <div>
    <h1>{{ article.title }}</h1>
    <p>{{ article.description }}</p>
    <ContentRenderer :value="article" />
  </div>
</template>


