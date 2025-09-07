<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { usePokemonStore } from './stores/pokemonStore';
import PokemonList from './components/PokemonList.vue';
import AlertMessage from './components/AlertMessage.vue';
import AddPokemonModal from './components/AddPokemonModal.vue';

const pokemonStore = usePokemonStore();
const showModal = ref(false);

// Computed properties para acessar o estado da store
const pokemons = computed(() => pokemonStore.pokemons);
const successMessage = computed(() => pokemonStore.successMessage);
const showSuccessMessage = computed(() => !!pokemonStore.successMessage);

// Funções
const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

onMounted(() => {
  pokemonStore.fetchPokemons();
});
</script>

<template>
  <div class="container">
    <div class="header-container">
      <h1>Meus Pokemons</h1>
      <button class="add-button" @click="openModal">
        <span class="add-icon">+</span>
        Adicionar Pokemon
      </button>
    </div>

    <AlertMessage
      type="success"
      :message="successMessage"
      :show="showSuccessMessage"
    />

    <div v-if="!pokemons.length" class="alert-info">
      Nenhum pokemon encontrado.
    </div>

    <PokemonList v-if="pokemons.length" />
  </div>

  <!-- Modal para adicionar Pokemon -->
  <AddPokemonModal
    :show="showModal"
    @close="closeModal"
  />
</template>

<style scoped>
/* Estilos específicos do componente, se necessário */
</style>
