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
if (diary.value) {
  // タイトルと createdAt から OGP を自動生成
  defineOgImageComponent("ArticleOg", {
    title: diary.value.title ?? "",
    date: diary.value.createdAt,
  });
  // 他のOG系メタもついでに
  useSeoMeta({
    ogTitle: diary.value.title,
    ogDescription: diary.value.description,
  });
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
      <NuxtLink class="link-to-top" to="/diaries" prefetch>一覧に戻る</NuxtLink>
    </template>
  </div>
</template>

<style>
.link-to-top {
  text-align: right;
  display: block;
}
</style>
