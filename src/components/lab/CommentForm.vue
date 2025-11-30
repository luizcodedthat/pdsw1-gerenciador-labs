<script setup>

import { ref } from 'vue';
import { Comment } from '@/models/CommentModel';
import { useRoute } from 'vue-router';
import { useCommentStore } from '@/stores/useCommentStore';
import { useAuthStore } from '@/stores/useAuthStore';

const route = useRoute();
const labId = route.params.id;

const commentStore = useCommentStore();
const auth = useAuthStore();

const text = ref("");
const sending = ref(false);

async function submitComment() {
  if (!text.value.trim()) return;

  sending.value = true;

  const commentModel = new Comment({
    labId,
    content: text.value,
    authorId: auth.user.id,
    authorName: auth.user.name,
    createdAt: new Date(),
  });

  try {
    await commentStore.addComment(commentModel);
    text.value = "";
  } catch (err) {
    console.error("Erro ao criar comentário:", err);
  }

  sending.value = false;
}

</script>

<template>

<div class="form">
    <form @submit.prevent="submitComment">
        <label for="comment-field">Deixe seu comentário</label>
        <textarea name="comment-field" id="comment-field" placeholder="Digite sua mensagem aqui" rows="3" v-model="text"></textarea>
        <button class="btn-primary" type="submit" :disabled="sending">{{ sending ? "Enviando..." : "Enviar comentário" }}</button>
    </form>
</div>

</template>

<style scoped>

#comment-field {
    padding: 5px;
    border-radius: 5px;
    resize: none;
    width: 100% ;
}

</style>