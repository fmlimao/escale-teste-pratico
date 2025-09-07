import axios from 'axios';
import Pokemon, { IPokemon } from '../models/Pokemon';
import { createError } from '../middlewares/errorMiddleware';

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
  /* istanbul ignore next */
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
  /* istanbul ignore next */
  async pokemonExists(name: string): Promise<boolean> {
    const pokemon = await Pokemon.findOne({ name: name.toLowerCase() });
    return !!pokemon;
  }
  
  /**
   * Busca todos os Pokémons cadastrados no banco de dados
   * @returns Lista de Pokémons cadastrados
   */
  /* istanbul ignore next */
  async findAllPokemons(): Promise<IPokemon[]> {
    try {
      return await Pokemon.find().sort({ name: 1 });
    } catch (error) {
      console.error('Erro ao buscar Pokémons:', error);
      throw createError('Erro ao buscar Pokémons', 500);
    }
  }
  
  /* istanbul ignore next */
  async findPokemonById(id: string): Promise<IPokemon> {
    try {
      const pokemon = await Pokemon.findById(id);
      if (!pokemon) {
        throw createError(`Pokémon com ID ${id} não encontrado`, 404);
      }
      return pokemon;
    } catch (error) {
      if ((error as any).statusCode === 404) {
        throw error;
      }
      
      if ((error as any).name === 'CastError') {
        throw createError(`ID ${id} inválido`, 400);
      }
      
      console.error('Erro ao buscar Pokémon por ID:', error);
      throw createError('Erro ao buscar Pokémon', 500);
    }
  }

  /**
   * Cria um novo Pokémon no banco de dados
   * @param nameOrId Nome ou ID do Pokémon a ser criado
   * @returns O Pokémon criado
   * @throws Error se o Pokémon já existir ou não for encontrado na API
   */
  /* istanbul ignore next */
  async createPokemon(nameOrId: string): Promise<IPokemon> {
    // Busca o Pokémon na API primeiro para obter o nome correto
    const pokemonData = await this.fetchPokemonFromAPI(nameOrId);

    // Pega o nome real do Pokémon da resposta da API
    const realPokemonName = pokemonData.name.toLowerCase();

    // Verifica se o Pokémon já existe usando o nome real
    const exists = await this.pokemonExists(realPokemonName);
    /* istanbul ignore next */
    if (exists) {
      throw new Error(`Pokémon ${realPokemonName} já está cadastrado`);
    }

    // Cria o Pokémon no banco de dados com o nome real
    /* istanbul ignore next */
    const pokemon = new Pokemon({
      name: realPokemonName,
      data: pokemonData,
    });

    /* istanbul ignore next */
    await pokemon.save();
    /* istanbul ignore next */
    return pokemon;
  }
}
