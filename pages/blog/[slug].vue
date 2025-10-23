<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const slug = route.params.slug;
console.log(slug);
const { data: article, error } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection("blog").path(`/blog/${slug}`).first()
);

if (error.value || !article.value) {
  // Nuxtのエラーページを出したいなら 404 を投げる
  throw createError({ statusCode: 404, statusMessage: "Document not found" });
}

if (article.value) {
  // タイトルと createdAt から OGP を自動生成
  // defineOgImageComponent("NuxtSeo", {
  //   title: article.value.title ?? "",
  //   description: article.value.description ?? "",
  //   theme: "light",
  //   // date: article.value.createdAt,
  // });
  // 他のOG系メタもついでに
  useSeoMeta({
    ogTitle: article.value.title,
    ogDescription: article.value.description,
  });
}
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
    <NuxtLink class="link-to-top" to="/blog" prefetch>一覧に戻る</NuxtLink>
  </div>
</template>

<style>
.link-to-top {
  text-align: right;
  display: block;
}
</style>
