<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const slug = route.params.slug;
const { data: diary, error } = await useAsyncData(`diary-${slug}`, () =>
  queryCollection("diaries").path(`/diaries/${slug}`).first()
);

if (error.value || !diary.value) {
  // Nuxtのエラーページを出したいなら 404 を投げる
  throw createError({ statusCode: 404, statusMessage: "Document not found" });
}
</script>

<template>
  <div>
    <template v-if="error">
      <h1>Document not found</h1>
    </template>
    <template v-else>
      <h1>{{ diary.title }}</h1>
      <ContentRenderer :value="diary" />
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
