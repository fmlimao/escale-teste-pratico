<script setup lang="ts">
import { ref } from 'vue';
import { usePokemonStore } from '../stores/pokemonStore';

// Props
interface Props {
  show: boolean;
}

// Emits
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps<Props>();
const pokemonStore = usePokemonStore();

// Estado local
const newPokemonName = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

// Métodos
const closeModal = () => {
  emit('close');
};

const savePokemon = async () => {
  if (!newPokemonName.value.trim()) {
    errorMessage.value = 'O nome do Pokemon é obrigatório';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const result = await pokemonStore.addPokemon(newPokemonName.value.trim());

    if (result.success) {
      newPokemonName.value = '';
      closeModal();
    } else {
      errorMessage.value = result.error || 'Erro ao adicionar Pokemon. Tente novamente.';
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
