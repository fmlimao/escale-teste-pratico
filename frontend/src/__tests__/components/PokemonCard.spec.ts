import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PokemonCard from '../../components/PokemonCard.vue';
import { createTestingPinia } from '@pinia/testing';

// Mock do confirm para evitar diálogos durante os testes
window.confirm = vi.fn(() => true);

describe('PokemonCard.vue', () => {
  const mockPokemon = {
    _id: '1',
    id: 25,
    name: 'pikachu',
    types: [
      {
        slot: 1,
        type: {
          name: 'electric',
          url: 'https://pokeapi.co/api/v2/type/13/'
        }
      }
    ],
    sprites: {
      front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
    }
  };

  it('renderiza corretamente com as propriedades do pokemon', () => {
    const wrapper = mount(PokemonCard, {
      props: {
        pokemon: mockPokemon
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    // Verifica se o nome do pokemon é exibido corretamente
    expect(wrapper.find('h5').text()).toBe('pikachu');
    
    // Verifica se o ID é exibido corretamente
    expect(wrapper.find('.id').text()).toContain('25');
    
    // Verifica se o tipo é exibido corretamente
    expect(wrapper.find('.abilities span').text()).toBe('electric');
    
    // Verifica se a imagem tem o src correto
    expect(wrapper.find('img').attributes('src')).toBe(mockPokemon.sprites.front_default);
  });

  it('emite evento view-details quando a imagem é clicada', async () => {
    const wrapper = mount(PokemonCard, {
      props: {
        pokemon: mockPokemon
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    // Simula o clique na imagem
    await wrapper.find('a').trigger('click');
    
    // Verifica se o evento foi emitido com o ID correto
    expect(wrapper.emitted('view-details')).toBeTruthy();
    expect(wrapper.emitted('view-details')[0]).toEqual(['1']);
  });

  it('emite evento edit-pokemon quando o botão de edição é clicado', async () => {
    const wrapper = mount(PokemonCard, {
      props: {
        pokemon: mockPokemon
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    // Simula o clique no botão de edição
    await wrapper.find('.edit-button').trigger('click');
    
    // Verifica se o evento foi emitido com o pokemon correto
    expect(wrapper.emitted('edit-pokemon')).toBeTruthy();
    expect(wrapper.emitted('edit-pokemon')[0]).toEqual([mockPokemon]);
  });

  it('chama deletePokemon do store quando o botão de exclusão é clicado', async () => {
    const wrapper = mount(PokemonCard, {
      props: {
        pokemon: mockPokemon
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
            initialState: {
              pokemon: {
                pokemons: [],
              }
            }
          }),
        ],
      },
    });

    // Acessa o store através do componente
    const pokemonStore = wrapper.vm.pokemonStore;
    
    // Espia o método deletePokemon
    const deleteSpy = vi.spyOn(pokemonStore, 'deletePokemon');
    
    // Simula o clique no botão de exclusão
    await wrapper.find('.delete-button').trigger('click');
    
    // Verifica se o método foi chamado com os parâmetros corretos
    expect(deleteSpy).toHaveBeenCalledWith('1', 'pikachu');
  });
});
