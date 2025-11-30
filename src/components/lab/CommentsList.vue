<script setup>
import CommentCard from './CommentCard.vue';

</script>

<template>

    <div class="cards-list">
        <CommentCard v-for="_ in [0, 1, 2, 3]" :key="_" authorName="Tartaruga estudante" profilePicture="/src/assets/images/tartaruga.svg" commentText="O ar-condicionado da esquerda está quebrado" :upvoteCount="50" />
    </div>

</template>

<style scoped>

.cards-list {
    padding: 10px 0;
}

</style>