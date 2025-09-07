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
const showModal = ref(false);
const newPokemonName = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const successMessage = ref('');
const showSuccessMessage = ref(false);

const fetchPokemons = async () => {
  try {
    const data = await api.getAll();
    pokemons.value = data;
  } catch (error) {
    console.error('Erro ao buscar pokemons:', error);
  }
};

const deletePokemon = async (id: string, pokemonName: string) => {
  if (confirm(`Tem certeza que deseja excluir o Pokemon ${pokemonName}?`)) {
    try {
      await api.delete(id);
      // Atualiza a lista de pokemons após a exclusão
      await fetchPokemons();
      // Mostra mensagem de sucesso
      showSuccessMessageWithTimeout(`Pokemon ${pokemonName} excluído com sucesso!`);
    } catch (error) {
      console.error('Erro ao excluir pokemon:', error);
      if (error instanceof Error) {
        showSuccessMessageWithTimeout(`Erro: ${error.message}`);
      }
    }
  }
};

const openModal = () => {
  showModal.value = true;
  newPokemonName.value = '';
  errorMessage.value = '';
};

const closeModal = () => {
  showModal.value = false;
};

const showSuccessMessageWithTimeout = (message: string) => {
  successMessage.value = message;
  showSuccessMessage.value = true;

  // Esconde a mensagem após 5 segundos
  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 5000);
};

const savePokemon = async () => {
  if (!newPokemonName.value.trim()) {
    errorMessage.value = 'O nome do Pokemon é obrigatório';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await api.create(newPokemonName.value.trim());
    closeModal();
    await fetchPokemons();

    // Exibe a mensagem de sucesso
    const pokemonName = response.name || newPokemonName.value;
    showSuccessMessageWithTimeout(`Pokemon ${pokemonName} adicionado com sucesso!`);
  } catch (error: any) {
    console.error('Erro ao salvar pokemon:', error);

    // Tratamento de erros
    if (error instanceof Error) {
      // Erro já formatado pelo serviço da API
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'Erro ao adicionar Pokemon. Tente novamente.';
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPokemons();
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

    <div v-if="showSuccessMessage" class="alert-success">
      {{ successMessage }}
    </div>

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
              <button class="delete-button" @click.prevent="deletePokemon(pokemon._id, pokemon.name)" title="Excluir Pokemon">
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

  <!-- Modal para adicionar Pokemon -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h3>Adicionar Pokemon</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <form @submit.prevent="savePokemon">
          <div class="form-group">
            <label for="pokemonName">Nome do Pokemon:</label>
            <input
              type="text"
              id="pokemonName"
              v-model="newPokemonName"
              required
              placeholder="Ex: pikachu"
              class="form-control"
            />
          </div>
          <div class="modal-footer">
            <button type="button" class="cancel-button" @click="closeModal" :disabled="isLoading">Cancelar</button>
            <button type="submit" class="save-button" :disabled="!newPokemonName || isLoading">
              {{ isLoading ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos específicos do componente, se necessário */
</style>
