<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { usePokemonStore } from '../stores/pokemonStore';
import { getPokemonImageUrl } from '../utils/pokemonImageUtils';

// Props
interface Props {
  show: boolean;
  pokemonId: string;
}

// Emits
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps<Props>();
const pokemonStore = usePokemonStore();

// Estado local
const isLoading = ref(false);
const errorMessage = ref('');
const pokemon = ref<any>(null);

// Métodos
const closeModal = () => {
  emit('close');
};

const fetchPokemonDetails = async () => {
  if (!props.pokemonId) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const data = await fetch(`/api/pokemons/${props.pokemonId}`).then(res => res.json());
    pokemon.value = data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do pokemon:', error);
    errorMessage.value = error instanceof Error ? error.message : 'Erro ao carregar detalhes do Pokemon';
  } finally {
    isLoading.value = false;
  }
};

// Observar mudanças nas props
watch(() => props.show, (newValue) => {
  if (newValue && props.pokemonId) {
    fetchPokemonDetails();
  }
});

// Carregar dados quando o componente for montado e estiver visível
onMounted(() => {
  if (props.show && props.pokemonId) {
    fetchPokemonDetails();
  }
});
</script>

<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal pokemon-detail-modal">
      <div class="modal-header">
        <h3 v-if="pokemon">{{ pokemon.name }}</h3>
        <h3 v-else>Detalhes do Pokemon</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="isLoading" class="loading">
          Carregando detalhes...
        </div>

        <div v-else-if="pokemon" class="pokemon-details">
          <div class="pokemon-header">
            <div class="pokemon-image">
              <img :src="getPokemonImageUrl(pokemon.sprites)" :alt="pokemon.name">
            </div>
            <div class="pokemon-info-header">
              <p class="pokemon-id">Nº {{ pokemon.id }}</p>
              <h2 class="pokemon-name">{{ pokemon.name }}</h2>
              <div class="pokemon-types">
                <span v-for="type in pokemon.types" :key="type.slot" class="pokemon-type">
                  {{ type.type.name }}
                </span>
              </div>
            </div>
          </div>

          <div class="pokemon-data-section">
            <h4>Habilidades</h4>
            <ul class="abilities-list">
              <li v-for="ability in pokemon.abilities" :key="ability.slot">
                {{ ability.ability.name }}
                <span v-if="ability.is_hidden" class="hidden-ability">(Habilidade oculta)</span>
              </li>
            </ul>
          </div>

          <div class="pokemon-data-section">
            <h4>Status</h4>
            <table class="stats-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="stat in pokemon.stats" :key="stat.stat.name">
                  <td>{{ stat.stat.name }}</td>
                  <td>{{ stat.base_stat }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pokemon-detail-modal {
  max-width: 600px;
  width: 90%;
}

.pokemon-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.pokemon-image {
  width: 120px;
  height: 120px;
  background-color: #f2f2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.pokemon-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.pokemon-info-header {
  flex: 1;
}

.pokemon-id {
  font-size: 14px;
  color: #919191;
  margin-bottom: 5px;
}

.pokemon-name {
  font-size: 24px;
  text-transform: capitalize;
  margin: 0 0 10px 0;
  color: #313131;
}

.pokemon-types {
  display: flex;
  gap: 10px;
}

.pokemon-type {
  padding: 5px 10px;
  border-radius: 3px;
  background-color: #f2f2f2;
  font-size: 12px;
  text-transform: uppercase;
}

.pokemon-data-section {
  margin-bottom: 20px;
}

.pokemon-data-section h4 {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 5px;
  margin-bottom: 10px;
  color: #313131;
}

.abilities-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.abilities-list li {
  padding: 5px 0;
  text-transform: capitalize;
}

.hidden-ability {
  font-size: 12px;
  color: #919191;
  margin-left: 5px;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
}

.stats-table th,
.stats-table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.stats-table th {
  font-weight: 600;
  color: #313131;
}

.stats-table td {
  text-transform: capitalize;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
