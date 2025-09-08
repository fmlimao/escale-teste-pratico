<script setup lang="ts">
import { usePokemonStore } from '../stores/pokemonStore';
import { getPokemonImageUrl } from '../utils/pokemonImageUtils';

// Props
interface Props {
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
  }
}

// Emits
const emit = defineEmits<{
  (e: 'view-details', id: string): void;
  (e: 'edit-pokemon', pokemon: Props['pokemon']): void;
}>();

const props = defineProps<Props>();
const pokemonStore = usePokemonStore();

// Métodos
const handleDelete = async () => {
  if (confirm(`Tem certeza que deseja excluir o Pokemon ${props.pokemon.name}?`)) {
    await pokemonStore.deletePokemon(props.pokemon._id, props.pokemon.name);
  }
};

const viewDetails = () => {
  emit('view-details', props.pokemon._id);
};

const handleEdit = () => {
  emit('edit-pokemon', props.pokemon);
};
</script>

<template>
  <li class="animating">
    <a href="#" @click.prevent="viewDetails">
      <img :src="getPokemonImageUrl(pokemon.sprites)" :alt="pokemon.name">
    </a>

    <div class="pokemon-info">
      <p class="id">
        <span class="number-prefix">Nº&nbsp;</span>{{ pokemon.id }}
      </p>
      <div class="pokemon-name-container">
        <h5>{{ pokemon.name }}</h5>
        <div class="action-buttons">
          <button class="edit-button" @click.prevent="handleEdit" title="Editar Pokemon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0066cc" viewBox="0 0 16 16">
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
            </svg>
          </button>
          <button class="delete-button" @click.prevent="handleDelete" title="Excluir Pokemon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0000" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="abilities">
        <span v-for="type in pokemon.types" :key="type.slot">
          {{ type.type.name }}
        </span>
      </div>
    </div>
  </li>
</template>
