<script setup lang="ts">
import { computed } from 'vue';
import { usePokemonStore } from '../stores/pokemonStore';
import PokemonCard from './PokemonCard.vue';

const pokemonStore = usePokemonStore();
const pokemons = computed(() => pokemonStore.pokemons);
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
      />
    </ul>
  </div>
</template>
