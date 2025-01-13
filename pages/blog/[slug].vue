<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const { data: article, error } = await useAsyncData(`blog-article-${route.params.slug}`, async () => {
  const content = await queryContent('blog', route.params.slug).findOne();
  if (!content) {
    throw new Error('Document not found');
  }
  return content;
});
</script>

<template>
  <div>
    <template v-if="error">
      <h1>Document not found</h1>
    </template>
    <template v-else>
      <h1>{{ article.title }}</h1>
      <ContentRenderer :value="article" />
    </template>
    <a class="link-to-top" href="/blog">一覧に戻る</a>
  </div>
</template>

<style>
.link-to-top {
  text-align: right;
  display: block;
}</style>
