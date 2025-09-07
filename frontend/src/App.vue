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

const deletePokemon = async (id: string) => {
  if (confirm('Tem certeza que deseja excluir este Pokemon?')) {
    try {
      await api.delete(id);
      // Atualiza a lista de pokemons após a exclusão
      fetchPokemons();
    } catch (error) {
      console.error('Erro ao excluir pokemon:', error);
    }
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
            <div class="pokemon-name-container">
              <h5>{{ pokemon.name }}</h5>
              <button class="delete-button" @click.prevent="deletePokemon(pokemon._id)" title="Excluir Pokemon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0000" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            </div>

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
