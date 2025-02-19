<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const { data: diary, error } = await useAsyncData(`diary-${route.params.slug}`, async () => {
  const diary = await queryContent('diaries', route.params.slug).findOne();
  if (!diary) {
    throw new Error('Document not found');
  }
  return diary;
});
</script>

<template>
  <div>
    <template v-if="error">
      <h1>Document not found</h1>
    </template>
    <template v-else>
      <h1>{{ diary.title }}</h1>
      <ContentRenderer :value="diary"/>
      <a class="link-to-top" href="/diaries">一覧に戻る</a>
    </template>
  </div>
</template>

<style>
.link-to-top {
  text-align: right;
  display: block;
}
</style>