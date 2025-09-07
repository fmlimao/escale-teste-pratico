<script setup lang="ts">
import { ref, watch } from 'vue';
import { usePokemonStore } from '../stores/pokemonStore';

// Props
interface Props {
  show: boolean;
  pokemon: {
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
  } | null;
}

// Emits
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps<Props>();
const pokemonStore = usePokemonStore();

// Estado local
const pokemonName = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

// Atualiza o nome do pokemon quando o props.pokemon muda
watch(() => props.pokemon, (newPokemon) => {
  if (newPokemon) {
    pokemonName.value = newPokemon.name;
  }
}, { immediate: true });

// Métodos
const closeModal = () => {
  emit('close');
};

const updatePokemon = async () => {
  if (!props.pokemon || !pokemonName.value.trim()) {
    errorMessage.value = 'O nome do Pokemon é obrigatório';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const result = await pokemonStore.updatePokemon(props.pokemon._id, pokemonName.value.trim());
    
    if (result.success) {
      closeModal();
    } else {
      errorMessage.value = result.error || 'Erro ao atualizar Pokemon. Tente novamente.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h3>Editar Pokemon</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <form @submit.prevent="updatePokemon">
          <div class="form-group">
            <label for="pokemonName">Nome do Pokemon:</label>
            <input 
              type="text" 
              id="pokemonName" 
              v-model="pokemonName" 
              required 
              placeholder="Ex: pikachu"
              class="form-control"
            />
          </div>
          <div class="modal-footer">
            <button type="button" class="cancel-button" @click="closeModal" :disabled="isLoading">Cancelar</button>
            <button type="submit" class="save-button" :disabled="!pokemonName || isLoading">
              {{ isLoading ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
