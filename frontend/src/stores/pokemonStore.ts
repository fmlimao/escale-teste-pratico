import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';
import aiService from '../services/aiService';

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

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemons = ref<Pokemon[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const successMessage = ref<string | null>(null);
  const aiMessage = ref<string | null>(null);

  // Buscar todos os pokemons
  const fetchPokemons = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await api.getAll();
      pokemons.value = data;
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Erro ao buscar pokemons';
      }
      console.error('Erro ao buscar pokemons:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Adicionar um novo pokemon
  const addPokemon = async (name: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await api.create(name);
      await fetchPokemons(); // Atualiza a lista após adicionar
      
      // Define a mensagem de sucesso
      const pokemonName = response.pokemon?.name || name;
      showSuccessMessage(`Pokemon ${pokemonName} adicionado com sucesso!`);
      
      // Busca informações de IA sobre o Pokémon
      fetchAiInfo(pokemonName);
      
      return { success: true };
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Erro ao adicionar pokemon';
      }
      console.error('Erro ao adicionar pokemon:', err);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Excluir um pokemon
  const deletePokemon = async (id: string, pokemonName: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      await api.delete(id);
      await fetchPokemons(); // Atualiza a lista após excluir

      // Define a mensagem de sucesso
      showSuccessMessage(`Pokemon ${pokemonName} excluído com sucesso!`);

      return { success: true };
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
        showSuccessMessage(`Erro: ${err.message}`);
      } else {
        error.value = 'Erro ao excluir pokemon';
        showSuccessMessage('Erro ao excluir pokemon');
      }
      console.error('Erro ao excluir pokemon:', err);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Mostrar mensagem de sucesso com timeout
  const showSuccessMessage = (message: string) => {
    successMessage.value = message;

    // Limpa a mensagem após 5 segundos
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
  };

  // Atualizar um pokemon
  const updatePokemon = async (id: string, name: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await api.update(id, name);
      await fetchPokemons(); // Atualiza a lista após editar
      
      // Define a mensagem de sucesso
      const pokemonName = response.pokemon?.name || name;
      showSuccessMessage(`Pokemon atualizado para ${pokemonName} com sucesso!`);
      
      // Busca informações de IA sobre o Pokémon
      fetchAiInfo(pokemonName);
      
      return { success: true };
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Erro ao atualizar pokemon';
      }
      console.error('Erro ao atualizar pokemon:', err);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };
  
  // Busca informações de IA sobre um Pokémon
  const fetchAiInfo = async (pokemonName: string) => {
    try {
      const info = await aiService.getPokemonInfo(pokemonName);
      if (info) {
        aiMessage.value = info;
      }
    } catch (error) {
      // Silenciosamente ignora erros
      console.warn('Erro ao buscar informações de IA:', error);
    }
  };

  return {
    pokemons,
    isLoading,
    error,
    successMessage,
    aiMessage,
    fetchPokemons,
    addPokemon,
    deletePokemon,
    updatePokemon,
    showSuccessMessage,
    fetchAiInfo
  };
});
