<!-- pages/diaries/index.vue -->
<template>
  <div>
    <h1>Diary</h1>

    <div v-if="diaries?.length" class="diary-list">
      <div v-for="post in diaries" :key="post.path" class="diary-card">
        <small>
          {{ post.createdAt }}
        </small>
        <NuxtLink :to="post.path">
          <p>{{ post.title ?? "(no title)" }}</p>
        </NuxtLink>
      </div>
    </div>

    <div v-else>記事がありません</div>

    <br />
    <a class="link-to-top" href="/">トップに戻る</a>
  </div>
</template>

<script setup lang="ts">
const { data: diaries } = await useAsyncData("diaries-list", () => {
  return queryCollection("diaries")
    .select("path", "title", "createdAt")
    .order("createdAt", "DESC")
    .all();
});
</script>

<style scoped>
.diary-list {
  gap: 1rem;
  padding: 0 8px;
}
h2 {
  font-size: 1rem;
}
.diary-card {
  max-width: 600px;
}
.link-to-top {
  text-align: right;
  display: block;
  padding: 1rem;
}
@media (max-width: 768px) {
  .diary-card {
    max-width: 100%;
    padding: 1rem;
  }
}
@media (max-width: 480px) {
  .diary-card {
    padding: 0.8rem;
  }
  .link-to-top {
    text-align: center;
  }
}
</style>
