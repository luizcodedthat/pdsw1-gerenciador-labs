<script setup>

import logo from '@/assets/images/logo.svg'

defineProps({
    width: {
        type: Number,
        default: 55
    }
})

</script>

<template>

<div class="logo-wrapper">
<div style="position: relative; display: inline-block;">
  <img class="logo-icon" :src="logo" alt="" :style="{ width: width + 'px' }">
  <div style="position: absolute; inset: 0; background: transparent;"></div>
</div>
<h3>Reserva Lab</h3>
</div>
</template>

<style scoped>

.logo-wrapper {
    display: flex;
    align-items: center;
    gap: 4px;
}

</style>