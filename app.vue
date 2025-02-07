<template>
  <div>
    <NuxtPage class="markdown-body" :document="article"/>
  </div>
  <footer><small>&copy 2025 ponyoxa</small></footer>
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

body {
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  max-width: 650px;
  padding: 0 16px;
  color: #333333;
  font-family: "BIZ UDPGothic", sans-serif !important;
}

footer {
  text-align: center;
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