<template>
  <main>
    <ContentDoc>
      <template #not-found>
        <h1>404 - Page Not Found</h1>
        <router-link to="/">Go back to Home</router-link>
      </template>
    </ContentDoc>
  </main>
</template>