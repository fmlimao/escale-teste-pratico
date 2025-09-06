import axios from 'axios';
import Pokemon, { IPokemon } from '../models/Pokemon';

// URL base da PokeAPI
const POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon';

/**
 * Serviço para gerenciar operações relacionadas a Pokémons
 */
export class PokemonService {
  /**
   * Busca um Pokémon na PokeAPI pelo nome
   * @param name Nome do Pokémon a ser buscado
   * @returns Dados do Pokémon encontrado
   * @throws Error se o Pokémon não for encontrado
   */
  async fetchPokemonFromAPI(name: string): Promise<any> {
    try {
      const response = await axios.get(`${POKE_API_URL}/${name.toLowerCase()}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`Pokémon ${name} não encontrado na PokeAPI`);
      }
      throw new Error(`Erro ao buscar Pokémon na PokeAPI: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Verifica se um Pokémon já existe no banco de dados
   * @param name Nome do Pokémon a ser verificado
   * @returns true se o Pokémon existe, false caso contrário
   */
  async pokemonExists(name: string): Promise<boolean> {
    const pokemon = await Pokemon.findOne({ name: name.toLowerCase() });
    return !!pokemon;
  }

  /**
   * Cria um novo Pokémon no banco de dados
   * @param name Nome do Pokémon a ser criado
   * @returns O Pokémon criado
   * @throws Error se o Pokémon já existir ou não for encontrado na API
   */
  async createPokemon(name: string): Promise<IPokemon> {
    // Verifica se o Pokémon já existe
    const exists = await this.pokemonExists(name);
    if (exists) {
      throw new Error(`Pokémon ${name} já está cadastrado`);
    }

    // Busca o Pokémon na API
    const pokemonData = await this.fetchPokemonFromAPI(name);

    // Cria o Pokémon no banco de dados
    const pokemon = new Pokemon({
      name: name.toLowerCase(),
      data: pokemonData,
    });

    await pokemon.save();
    return pokemon;
  }
}
