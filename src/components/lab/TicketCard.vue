<script setup>
import { Calendar } from 'lucide-vue-next';
import { computed, defineProps } from 'vue';

const props = defineProps({
    createdDate: Number,
    status: {
        default: 'open',
        type: String
    },
    title: String,
    message: String
})

const statusText = computed(() => {
    switch (props.status.toLowerCase()) {
        case 'aberto':
            return 'Aberto';
        case 'em andamento':
            return 'Em andamento';
        case 'concluído':
            return 'Concluído';
        case 'fechado':
            return 'Fechado';
        default:
            return 'Status desconhecido';
    }
})

const statusClass = computed(() => {
    return {
        'open-tag': statusText.value === 'Aberto',
        'in-progress-tag': statusText.value === 'Em andamento',
        'finished-tag': statusText.value === 'Concluído',
        'closed-tag': statusText.value === 'Fechado',
    };
});

const createdAt = computed(() => {
  if (!props.createdDate) return "";

  const date = new Date(props.createdDate);

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
});

const limitarTexto = (texto = "", limite = 0) => {
  if (!texto) return "";
  return texto.length > limite ? texto.substring(0, limite) + "..." : texto;
};

</script>

<template>

    <div class="card">
        <div class="card-top">
            <div class="created-date">
                <Calendar size="16" color="#64748B" />
                {{ createdAt }}
            </div>
            <div class="status-tag" :class="statusClass">
                {{ statusText }}
            </div>
        </div>
        <div class="card-info">
            <h3 class="ticket-title"> {{ limitarTexto(title, 30) }} </h3>
            <p class="ticket-message"> {{ limitarTexto(message, 75) }} </p>
        </div>

    </div>

</template>

<style scoped>
.card {
    width: fit-content;
    min-width: 260px;
    max-width: 350px;
    border-radius: 5px;
    padding: 20px;

    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-top {
    display: flex;
    justify-content: space-between;
}

.created-date {
    color: var(--color-gray-text);
    font-size: var(--font-size-sm);
    display: flex;
    align-items: center;
    gap: 4px;
}

.status-tag {
    font-size: var(--font-size-sm);
    padding: 4px 10px;
    border-radius: 10px;
}

.open-tag {
  background: #fde68a;
  color: #92400e;
}

.in-progress-tag {
  background: #fdba74;
  color: #9a3412;
}

.finished-tag {
  background: #bbf7d0;
  color: #166534;
}

.closed-tag {
  background: #fecaca;
  color: #991b1b;
}

.card-info {
    margin: 10px 0 4px 0;
}

.ticket-title {
    font-size: var(--font-size-base);
    font-weight: 500;
    margin-bottom: 4px;
}

.ticket-message {
    color: var(--color-gray-text);
    font-size: var(--font-size-base);
}
</style>