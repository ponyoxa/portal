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
    <ContentRenderer :value="article" />
  </div>
  <a class="link-to-top" href="/blog">一覧に戻る</a>
</template>

<style>
.link-to-top {
  text-align: right;
  display: block;
}</style>
