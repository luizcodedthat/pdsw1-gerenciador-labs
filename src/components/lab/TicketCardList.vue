<script setup>
import TicketCard from './TicketCard.vue';
import { TvIcon } from 'lucide-vue-next';

const noTicketsAvailable = true;

</script>

<template>

    <div class="cards-list">
        <TicketCard v-for="_ in []" :key="_" title="Teste" message="Testado com sucesso." status="in progress"
            :createdDate="new Date().toLocaleDateString('pt-br')" />

    </div>

    <div class="no-tickets" v-if="noTicketsAvailable">
        <TvIcon size="48" color="#64748B" />
        <p>Tudo limpo! Nenhum chamado recente.</p>
    </div>

</template>

<style scoped>
.cards-list {
    padding: 10px 4px;
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.no-tickets {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 5px;
    margin: auto;
    width: fit-content;
}

.no-tickets p {
    color: hsl(215, 19%, 35%);
}
</style>