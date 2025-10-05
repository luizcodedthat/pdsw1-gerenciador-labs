<script setup>

import { ref, onMounted } from 'vue';

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

const mockData = ref({})

onMounted(async () => {
    const response = await fetch(`http://localhost:3000/listaLabs?id=${props.id}`)
    const data = await response.json()
    mockData.value = data[0]
})

</script>

<template>
    <div class="loading" v-if="!mockData">Aguarde...</div>
    <div class="wrapper" v-if="mockData">
        <section id="lab-info">

            <h1 class="lab-title"></h1>
            <h3 class="lab-category"></h3>

            <div class="lab-cards">

                <div class="lab-reservation"></div>
                <div class="info-cards"></div>

            </div>

        </section>

        <section id="last-tickets">
            <div class="header"></div>
            <div class="card-list"></div>
        </section>

        <section id="comments">
            <div class="header"></div>
            <div class="comments-list"></div>
            <div class="comment-form"></div>
        </section>

    </div>

</template>

<style scoped></style>