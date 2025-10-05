<script setup>

import { ref } from 'vue';
import { Search } from 'lucide-vue-next';

defineProps({
    placeholder: {
        type: String,
        default: 'Busque pelo nome, ex.: Lab 07'
    },
    buttonLabel: {
        type: String,
        default: 'Buscar'
    }
});

const filter = ref('');

const emit = defineEmits(['search']);

const onSearch = () => {
  emit('search', filter.value)
}

</script>

<template>

<div class="search-area">
    <div class="input-wrapper">
        <Search class="input-icon" color="#94A3B8" />
        <input
            v-model="filter"
            @keyup.enter="onSearch" 
            type="text"
            name="search-lab"
            id="search-lab"
            :placeholder="placeholder" />
    </div>
    <button @click="onSearch" class="btn-primary">{{ buttonLabel }}</button>
</div>

</template>

<style scoped>

.search-area {
  margin: 0 auto;
  width: 40rem;
  display: flex;
  gap: .8rem;
  margin-top: 40px;
}

.search-area #search-lab {
  flex: 1;
  box-sizing: border-box;
  padding: 8px 12px 8px 30px;
  border-radius: 5px;
  border: 1px solid #CBD5E1;
  width: 100%;
}

.input-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.input-wrapper .input-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #888;
  pointer-events: none;
}

</style>