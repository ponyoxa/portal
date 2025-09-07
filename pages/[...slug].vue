<!-- <template>
  <main>
    <ContentDoc>
      <template #not-found>
        <h1>404 - Page Not Found</h1>
        <router-link to="/">Go back to Home</router-link>
      </template>
    </ContentDoc>
  </main>
</template> -->

<!-- pages/[...slug].vue -->
<script setup lang="ts">
const route = useRoute();
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection("content").path(route.path).first()
);
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <div v-else>Not found</div>
</template>
