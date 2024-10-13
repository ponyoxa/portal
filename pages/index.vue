<template>
  <div>
    <h1>ponyoxa Blog</h1>
    <ul>
      <li v-for="article in articles" :key="article._path">
        <NuxtLink :to="article._path">{{ article.title }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
const { data: articles } = await useAsyncData('content', () =>
  queryContent().find()
);
</script>
