<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from './services/api';

// Definição do tipo Pokemon
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
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    }
  }>;
}

const pokemons = ref<Pokemon[]>([]);

const fetchPokemons = async () => {
  try {
    const data = await api.getAll();
    pokemons.value = data;
  } catch (error) {
    console.error('Erro ao buscar pokemons:', error);
  }
};

onMounted(() => {
  fetchPokemons();
});
</script>

<template>
  <div class="container">
    <h1>Meus Pokemons</h1>

    <div v-if="!pokemons.length" class="alert-info">
      Nenhum pokemon encontrado.
    </div>

    <div class="pokedex-results">
      <p class="results-count">
        Total de pokemons: {{ pokemons.length }}
      </p>

      <ul class="results" style="height: auto;">
        <li class="animating" v-for="pokemon in pokemons" :key="pokemon._id">
          <a href="#">
            <img :src="pokemon.sprites.front_default" :alt="pokemon.name">
          </a>

          <div class="pokemon-info">
            <p class="id">
              <span class="number-prefix">Nº&nbsp;</span>{{ pokemon.id }}
            </p>
            <h5>{{ pokemon.name }}</h5>

            <div class="abilities">
              <span v-for="type in pokemon.types" :key="type.slot">
                {{ type.type.name }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Estilos específicos do componente, se necessário */
</style>
