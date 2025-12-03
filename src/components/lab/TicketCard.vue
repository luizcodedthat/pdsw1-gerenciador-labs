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
        'open-tag': statusText.value === 'open',
        'in-progress-tag': statusText.value === 'in progress',
        'finished-tag': statusText.value === 'finished',
        'closed-tag': statusText.value === 'closed',
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
            <h3 class="ticket-title"> {{ title }} </h3>
            <p class="ticket-message"> {{ message }} </p>
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
    background-color: hsl(50, 98%, 64%);
}

.in-progress-tag {
    background-color: hsl(31, 97%, 72%);
}

.finished-tag {
    background-color: hsl(142, 77%, 73%);
}

.closed-tag {
    background-color: hsl(0, 94%, 82%);
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