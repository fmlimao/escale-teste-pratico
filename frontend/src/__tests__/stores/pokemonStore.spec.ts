import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePokemonStore } from '../../stores/pokemonStore';

// Mock do módulo api
vi.mock('../../services/api', () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

import api from '../../services/api';

describe('pokemonStore', () => {
  beforeEach(() => {
    // Cria uma nova instância do Pinia para cada teste
    setActivePinia(createPinia());
    
    // Limpa todos os mocks
    vi.clearAllMocks();
  });

  it('inicializa com o estado correto', () => {
    const store = usePokemonStore();
    
    expect(store.pokemons).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.successMessage).toBeNull();
  });

  it('fetchPokemons busca todos os pokemons com sucesso', async () => {
    const mockPokemons = [
      { _id: '1', name: 'pikachu', id: 25 },
      { _id: '2', name: 'charmander', id: 4 }
    ];
    
    // Mock da resposta da API
    vi.mocked(api.getAll).mockResolvedValue(mockPokemons);
    
    const store = usePokemonStore();
    await store.fetchPokemons();
    
    expect(api.getAll).toHaveBeenCalled();
    expect(store.pokemons).toEqual(mockPokemons);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('fetchPokemons trata erros corretamente', async () => {
    const errorMessage = 'Erro ao buscar pokemons';
    
    // Mock de erro da API
    vi.mocked(api.getAll).mockRejectedValue(new Error(errorMessage));
    
    const store = usePokemonStore();
    await store.fetchPokemons();
    
    expect(api.getAll).toHaveBeenCalled();
    expect(store.pokemons).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBe(errorMessage);
  });

  it('addPokemon adiciona um pokemon com sucesso', async () => {
    const pokemonName = 'pikachu';
    const mockResponse = { 
      pokemon: { name: 'pikachu', id: 25 }
    };
    
    // Mock da resposta da API
    vi.mocked(api.create).mockResolvedValue(mockResponse);
    vi.mocked(api.getAll).mockResolvedValue([mockResponse.pokemon]);
    
    const store = usePokemonStore();
    const result = await store.addPokemon(pokemonName);
    
    expect(api.create).toHaveBeenCalledWith(pokemonName);
    expect(api.getAll).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(store.successMessage).toContain('pikachu');
    expect(store.isLoading).toBe(false);
  });

  it('addPokemon trata erros corretamente', async () => {
    const pokemonName = 'pikachu';
    const errorMessage = 'Erro ao adicionar pokemon';
    
    // Mock de erro da API
    vi.mocked(api.create).mockRejectedValue(new Error(errorMessage));
    
    const store = usePokemonStore();
    const result = await store.addPokemon(pokemonName);
    
    expect(api.create).toHaveBeenCalledWith(pokemonName);
    expect(result.success).toBe(false);
    expect(result.error).toBe(errorMessage);
    expect(store.error).toBe(errorMessage);
    expect(store.isLoading).toBe(false);
  });

  it('updatePokemon atualiza um pokemon com sucesso', async () => {
    const pokemonId = '1';
    const pokemonName = 'raichu';
    const mockResponse = { 
      pokemon: { name: 'raichu', id: 26 }
    };
    
    // Mock da resposta da API
    vi.mocked(api.update).mockResolvedValue(mockResponse);
    vi.mocked(api.getAll).mockResolvedValue([mockResponse.pokemon]);
    
    const store = usePokemonStore();
    const result = await store.updatePokemon(pokemonId, pokemonName);
    
    expect(api.update).toHaveBeenCalledWith(pokemonId, pokemonName);
    expect(api.getAll).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(store.successMessage).toContain('raichu');
    expect(store.isLoading).toBe(false);
  });

  it('deletePokemon exclui um pokemon com sucesso', async () => {
    const pokemonId = '1';
    const pokemonName = 'pikachu';
    
    // Mock da resposta da API
    vi.mocked(api.delete).mockResolvedValue({ message: 'Pokemon excluído com sucesso' });
    vi.mocked(api.getAll).mockResolvedValue([]);
    
    const store = usePokemonStore();
    const result = await store.deletePokemon(pokemonId, pokemonName);
    
    expect(api.delete).toHaveBeenCalledWith(pokemonId);
    expect(api.getAll).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(store.successMessage).toContain('pikachu');
    expect(store.isLoading).toBe(false);
  });
});
