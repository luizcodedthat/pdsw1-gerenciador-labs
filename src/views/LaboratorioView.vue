<script setup>

import { onMounted, ref } from 'vue'
import { PlusCircle } from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import CommentsList from '@/components/lab/CommentsList.vue'
import CommentForm from '@/components/lab/CommentForm.vue'
import TicketCardList from '@/components/lab/TicketCardList.vue'
import { useLabStore } from '@/stores/useLabStore'
import LabInfo from '@/components/lab/LabInfo.vue'


import CreateModal from '@/components/chamados/CreateModal.vue'


const modalAberto = ref(false)

const props = defineProps({ id: String })

const labStore = useLabStore()

onMounted(async () => {
    labStore.loadLabById(props.id)
})

function criarChamado(data) {
  console.log("Chamado criado:", data)
}
</script>

<template>
    <Navbar />
    <div class="loading" v-if="labStore.loading">Aguarde...</div>
    <div class="wrapper" v-if="!labStore.loading">

        <section id="lab-info">
            <LabInfo :id="id" />
        </section>

        <section id="last-tickets">
            <div class="header right-icon">
                <div class="header-text">
                    <h2 class="section-title">Chamados</h2>
                    <h3 class="section-subtitle">Últimos chamados do laboratório</h3>
                </div>

                <!-- ÍCONE ABRE O MODAL -->
                <PlusCircle
                    size="24"
                    @click="modalAberto = true"
                    style="cursor:pointer;"
                />
            </div>

            <div class="card-list">
                <TicketCardList />
            </div>
        </section>

        <section id="comments">
            <div class="header">
                <h2 class="section-title">Comentários</h2>
                <h3 class="section-subtitle">Comentários sobre o estado do laboratório.</h3>
            </div>
            <CommentsList />
            <CommentForm />
        </section>

        <!-- MODAL CHAMADO -->
        <CreateModal
            v-model="modalAberto"
            @save="criarChamado"
            :labId="id"
        />

    </div>

</template>

<style scoped>
.wrapper {
    max-width: 1200px;
    margin: 2.5rem auto;
    box-sizing: content-box;
    padding: 0 1rem;
}

section {
    margin-bottom: 10px;
    padding: 10px 0;
}

.header {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 40px 0 0;
}

.right-icon {
    flex-direction: row;
}

.section-title {
    margin-bottom: 6px;
}

.section-subtitle {
    font-size: var(--font-size-lg);
    font-weight: 400;
    color: hsl(215, 19%, 35%);
}
</style>
