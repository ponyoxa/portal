<template>
    <div>
        <h1>Diary</h1>
        <div v-if="data" class="diary-list">
            <div
                v-for="diary in sortedData"
                :key="diary._path"
                class="diary-card"
            >
                <small>
                    {{ new Date(diary.createdAt).toLocaleDateString() }}
                </small>
                <NuxtLink :to="`/diaries/${diary._path.split('/').pop()}`">
                    <p>{{ diary.title }}</p>
                </NuxtLink>
            </div>
        </div>
        <br />
        <a class="link-to-top" href="/">トップに戻る</a>
    </div>
</template>

<script setup>
const { data } = await useAsyncData("diariesData", async () => {
    const content = await queryContent("diaries").find();
    return content;
});

// 日付の新しい順に並び替え
const sortedData = computed(() => {
    return data.value?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
});
</script>

<style scoped>
.diary-list {
    gap: 1rem;
    padding: 0 8px; /* 左右のパディングを追加してレスポンシブ対応 */
}

h2 {
    font-size: 1rem;
}

.diary-card {
    max-width: 600px; /* カードの最大幅を設定 */
}

.link-to-top {
    text-align: right;
    display: block;
    padding: 1rem;
}

/* レスポンシブデザイン用のメディアクエリ */
@media (max-width: 768px) {
    .diary-card {
        max-width: 100%; /* カード幅を画面幅に合わせる */
        padding: 1rem;
    }
}

@media (max-width: 480px) {
    .diary-card {
        padding: 0.8rem; /* モバイルでのパディング調整 */
    }

    .link-to-top {
        text-align: center; /* 小さい画面では中央揃え */
    }
}
</style>
