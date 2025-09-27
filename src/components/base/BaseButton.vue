<script setup>

defineProps({
    variant: {
        type: String,
        default: 'primary'
    },
    type: {
        type: String,
        default: 'button'
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

</script>

<template>
<button :class="['btn-base', `btn-${variant}`]" :disabled="disabled" :type="type"> <slot></slot> </button>
</template>

<style scoped>

.btn-base {
    border-radius: 5px;
    border: none;

    box-sizing: border-box;
    padding: 8px 16px;

    cursor: pointer;
}

.btn-base:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
    border-radius: 5px;
    border: none;
    background-color: var(--color-primary);
    color: white;

    box-sizing: border-box;
    padding: 8px 16px;

    cursor: pointer;
}

.btn-secondary {
    border-radius: 5px;
    border: 2px solid var(--color-black);
    background-color: transparent;
    color: var(--color-black);
}

</style>