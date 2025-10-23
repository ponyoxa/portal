<!-- components/OgImage/ArticleOg.vue -->
<template>
  <div :style="root">
    <div :style="titleStyle">{{ title }}</div>
    <div :style="metaStyle">{{ formattedDate }}</div>
    <div :style="brandStyle">ponyoxa blog</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ title: string; date?: string }>();

const formattedDate = computed(() => {
  if (!props.date) return "";
  const d = new Date(props.date);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
});

import type { CSSProperties } from "vue";

const root: CSSProperties = {
  width: "1200px",
  height: "630px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "80px",
  background: "#111",
  color: "#fff",
  font: "'BIZ UDPGothic', sans-serif",
};
const titleStyle: CSSProperties = {
  fontSize: "64px",
  fontWeight: 800,
  lineHeight: 1.2,
  wordBreak: "break-word",
};
const metaStyle: CSSProperties = { fontSize: "28px", opacity: 0.85 };
const brandStyle: CSSProperties = { fontSize: "24px", opacity: 0.6 };
</script>
