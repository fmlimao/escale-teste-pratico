<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePokemonStore } from '../stores/pokemonStore';
import PokemonCard from './PokemonCard.vue';
import PokemonDetailModal from './PokemonDetailModal.vue';

const pokemonStore = usePokemonStore();
const pokemons = computed(() => pokemonStore.pokemons);

// Estado para a modal de detalhes
const showDetailModal = ref(false);
const selectedPokemonId = ref('');

// Método para abrir a modal de detalhes
const handleViewDetails = (id: string) => {
  selectedPokemonId.value = id;
  showDetailModal.value = true;
};

// Método para fechar a modal de detalhes
const closeDetailModal = () => {
  showDetailModal.value = false;
};
</script>

<template>
  <div class="pokedex-results">
    <p class="results-count">
      Total de pokemons: {{ pokemons.length }}
    </p>

    <ul class="results" style="height: auto;">
      <PokemonCard 
        v-for="pokemon in pokemons" 
        :key="pokemon._id" 
        :pokemon="pokemon"
        @view-details="handleViewDetails"
      />
    </ul>
    
    <!-- Modal de detalhes do Pokemon -->
    <PokemonDetailModal
      :show="showDetailModal"
      :pokemon-id="selectedPokemonId"
      @close="closeDetailModal"
    />
  </div>
</template>
