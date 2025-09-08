<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePokemonStore } from '../stores/pokemonStore';
import PokemonCard from './PokemonCard.vue';
import PokemonDetailModal from './PokemonDetailModal.vue';
import EditPokemonModal from './EditPokemonModal.vue';

const pokemonStore = usePokemonStore();
const pokemons = computed(() => pokemonStore.pokemons);

// Estado para a modal de detalhes
const showDetailModal = ref(false);
const selectedPokemonId = ref('');

// Estado para a modal de edição
const showEditModal = ref(false);
const selectedPokemon = ref(null);

// Método para abrir a modal de detalhes
const handleViewDetails = (id: string) => {
  selectedPokemonId.value = id;
  showDetailModal.value = true;
};

// Método para fechar a modal de detalhes
const closeDetailModal = () => {
  showDetailModal.value = false;
};

// Interface para o Pokemon
interface Pokemon {
  _id: string;
  id: number;
  name: string;
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    }
  }>;
  sprites: {
    front_default: string;
    [key: string]: any;
  };
}

// Método para abrir a modal de edição
const handleEditPokemon = (pokemon: Pokemon) => {
  selectedPokemon.value = pokemon;
  showEditModal.value = true;
};

// Método para fechar a modal de edição
const closeEditModal = () => {
  showEditModal.value = false;
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
        @edit-pokemon="handleEditPokemon"
      />
    </ul>

    <!-- Modal de detalhes do Pokemon -->
    <PokemonDetailModal
      :show="showDetailModal"
      :pokemon-id="selectedPokemonId"
      @close="closeDetailModal"
    />

    <!-- Modal de edição do Pokemon -->
    <EditPokemonModal
      :show="showEditModal"
      :pokemon="selectedPokemon"
      @close="closeEditModal"
    />
  </div>
</template>
