<script setup>

import { ref, computed, onMounted } from 'vue';
import LabCardList from '@/components/labs/LabCardList.vue';
import SearchArea from '@/components/labs/SearchArea.vue';
import Navbar from '@/components/Navbar.vue';

const mockData = ref([])
const filter = ref('')

onMounted(async () => {
  const response = await fetch('http://localhost:3000/listaLabs')
  mockData.value = await response.json()
})

const onSearch = (value) => {
  filter.value = value
}

const filteredLabs = computed(() => {
  return mockData.value?.filter(
    (l) => l.name.toLowerCase().includes(filter.value.toLowerCase())
  ) || []
})

</script>

<template>
  <div>
    <Navbar />
  </div>
  <div id="content">

    <SearchArea @search="onSearch" />
    <LabCardList :labList="filteredLabs" />

  </div>
</template>

<style scoped>
#content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
</style>
