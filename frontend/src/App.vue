<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { usePokemonStore } from './stores/pokemonStore';
import PokemonList from './components/PokemonList.vue';
import AlertMessage from './components/AlertMessage.vue';
import AddPokemonModal from './components/AddPokemonModal.vue';
import AiInfoMessage from './components/AiInfoMessage.vue';
import ChatbotButton from './components/ChatbotButton.vue';

const pokemonStore = usePokemonStore();
const showModal = ref(false);

// Computed properties para acessar o estado da store
const pokemons = computed(() => pokemonStore.pokemons);
const successMessage = computed(() => pokemonStore.successMessage);
const showSuccessMessage = computed(() => !!pokemonStore.successMessage);
const aiMessage = computed(() => pokemonStore.aiMessage);

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
      <h1>
        <img src="/images/poke-ball.png" alt="Pokeball" class="pokeball-icon" />
        Escale Pokedex
      </h1>
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
    
    <AiInfoMessage
      :message="aiMessage"
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
  
  <!-- Chatbot -->
  <ChatbotButton />
</template>

<style scoped>
.pokeball-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
}

h1 {
  display: flex;
  align-items: center;
  color: #e3350d; /* Vermelho Pokémon */
}
</style>
