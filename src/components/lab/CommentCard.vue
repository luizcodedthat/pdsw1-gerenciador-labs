<script setup>

import { ArrowBigUp } from 'lucide-vue-next';
import { defineProps } from 'vue';

const props = defineProps({
    profilePicture: {
        default: '',
        type: String
    },
    authorName: String,
    commentText: String,
    upvoteCount: Number
})

console.log(props.profilePicture)

</script>

<template>
    <div class="comment-box">
        <div class="user-comment-section">
            <div class="profile-picture">
                <img class="user-profile-picture" :src="profilePicture" :alt="authorName">
            </div>
            <div class="text-section">
                <h3 class="author-name">{{ authorName }}</h3>
                <p class="comment-text">{{ commentText }}</p>
            </div>
        </div>
        <div class="upvote-section">
            <ArrowBigUp />
            <p class="upvote-count">{{ upvoteCount }}</p>
        </div>
    </div>

</template>

<style scoped>
.comment-box {
    padding: 5px 0;
    margin-bottom: 5px;
}

.user-comment-section {
    display: flex;
}

.profile-picture {
    padding: 5px 0 0 0;
}

.user-profile-picture {
    border-radius: 50%;
    width: 48px;
}

.text-section {
    padding: 10px;
    margin-bottom: 5px;
}

.author-name {
    font-size: var(--font-size-base);
    font-weight: 500;
    margin-bottom: 5px;
}

.comment-text {
    font-size: var(--font-size-base);
}

.upvote-section {
    display: flex;
    gap: 10px;
    padding: 0 10px 0 60px;
}
</style>