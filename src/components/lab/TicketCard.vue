<script setup>
import { Calendar } from 'lucide-vue-next';
import { computed, defineProps } from 'vue';

const props = defineProps({
    createdDate: String,
    status: {
        default: 'open',
        type: String
    },
    title: String,
    message: String
})

const statusText = computed(() => {
    switch (props.status) {
        case 'open':
            return 'Aberto';
        case 'in progress':
            return 'Em andamento';
        case 'finished':
            return 'Finalizado';
        case 'closed':
            return 'Fechado';
        default:
            return 'Status desconhecido';
    }
})

const statusClass = computed(() => {
    return {
        'open-tag': props.status === 'open',
        'in-progress-tag': props.status === 'in progress',
        'finished-tag': props.status === 'finished',
        'closed-tag': props.status === 'closed',
    };
});
</script>

<template>

    <div class="card">
        <div class="card-top">
            <div class="created-date">
                <Calendar size="16" color="#64748B" />
                {{ createdDate }}
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