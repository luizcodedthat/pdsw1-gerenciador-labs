<script setup>

defineProps({

    id: {
        type: String,
        default: ''
    },

    label: {
        type: String,
        default: ''
    },

    description: {
        type: String,
        default: ''
    },

    placeholder: {
        type: String,
        default: ''
    },

    disabled: {
        type: Boolean,
        default: false
    },

    required: {
        type: Boolean,
        default: false
    },
})

</script>

<template>

 <div class="input-wrapper">

    <label :for="id" class="input-label" v-if="label">{{ label }}</label>

    <input :id="id" class="input-text" type="text" :placeholder="placeholder" :required="required" :disabled="disabled" v-bind="$attrs">

    <p class="input-description" v-if="description">{{ description }}</p>
</div>

</template>

<style scoped>

.input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.input-text {
    border-radius: 6px;
    border: 1px solid var(--color-gray-border);

    padding: 8px 56px 8px 12px;
}

.input-text::placeholder {
    color: hsl(215, 20%, 65%);
}

.input-text:focus {
    outline: none;
    border: 1px solid var(--color-primary);
}

.input-text:disabled {
    background-color: hsl(210, 40%, 96%);
    color: hsl(215, 16%, 47%);
    cursor: not-allowed;
    opacity: 0.7;
}

.input-label {
    font-size: var(--font-size-sm);
    line-height: var(--line-height-normal);
    font-weight: 500;
}

.input-description {
    font-size: var(--font-size-sm);
    line-height: var(--line-height-normal);
    color: var(--color-gray-text);
    margin: 0;
}
</style>