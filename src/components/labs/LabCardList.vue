<script setup>

import LabCard from './LabCard.vue';

defineProps({
    labList: {
        type: Array,
        required: true
    }
})

</script>

<template>

<div id="labs-list">
    <span v-if="labList.length === 0">Nenhum laboratório encontrado.</span>
    <LabCard
        v-for="lab in labList"
        :key="lab.id"
        :labId="lab.id"
        :name="lab.name"
        :capacity="lab.capacity"
    />
</div>

</template>

<style scoped>

#labs-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: center;

  max-width: 1200px;
  margin: 0 auto;

  padding: 0 1rem;
}

</style>