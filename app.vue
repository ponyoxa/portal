<template>
  <div>
    <NuxtPage class="markdown-body" :document="article"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      article: {} // Define the article property
    };
  }
};
</script>

<style>
html {
  font-family: "BIZ UDPGothic", sans-serif !important;
}

body {
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  max-width: 650px;
  padding: 0 16px;
  color: #333333;
}

@media (max-width: 768px) {
  body {
    max-width: 100%; /* 幅を画面全体に合わせる */
    padding: 0 12px; /* モバイルでの左右の余白 */
  }
}

p {
  line-height: 150%;
}

body {
  margin-bottom: 100px;
}
</style>