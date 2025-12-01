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
    labId: labId,
    authorId: auth.user.uid,
    authorName: auth.user.displayName,
    content: text.value,
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
      <label id="comment-label" for="comment-field">Deixe seu comentário</label>
      <textarea name="comment-field" id="comment-field" placeholder="Digite sua mensagem aqui" rows="3"
        v-model="text"></textarea>
      <button class="btn-primary" type="submit" :disabled="sending">{{ sending ? "Enviando..." : "Enviar comentário"
        }}</button>
    </form>
  </div>

</template>

<style scoped>
#comment-label {
  font-weight: 500;
}

#comment-field {
  padding: 8px 10px;
  border-radius: 5px;
  resize: none;
  width: 100%;
  margin-bottom: 8px;
  border: 1px solid var(--color-gray-border);
  color: var(--color-gray-text);
}

.btn-primary {
  width: 100%;
  padding: 10px;
  font-weight: 500;
}
</style>