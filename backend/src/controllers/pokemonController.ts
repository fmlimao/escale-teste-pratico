import { Request, Response, NextFunction } from 'express';
import { PokemonService } from '../services/pokemonService';
import { createError } from '../middlewares/errorMiddleware';

/**
 * Controller para gerenciar as requisições relacionadas a Pokémons
 */
export class PokemonController {
  private pokemonService: PokemonService;

  constructor() {
    this.pokemonService = new PokemonService();
  }

  /**
   * Lista todos os Pokémons cadastrados
   * @param req Requisição Express
   * @param res Resposta Express
   * @param next Função para passar para o próximo middleware
   */
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pokemons = await this.pokemonService.findAllPokemons();

      // Mapeia os Pokémons para retornar apenas os campos necessários
      const formattedPokemons = pokemons.map(pokemon => ({
        id: pokemon._id,
        name: pokemon.name,
        types: pokemon.data.types,
        sprites: pokemon.data.sprites,
        abilities: pokemon.data.abilities,
        stats: pokemon.data.stats,
        createdAt: pokemon.createdAt
      }));

      res.status(200).json({
        count: pokemons.length,
        pokemons: formattedPokemons
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca um Pokémon pelo ID
   * @param req Requisição Express
   * @param res Resposta Express
   * @param next Função para passar para o próximo middleware
   */
  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        next(createError('ID do Pokémon é obrigatório', 400));
        return;
      }

      const pokemon = await this.pokemonService.findPokemonById(id);

      // Formata o Pokémon para retornar apenas os campos necessários
      const formattedPokemon = {
        id: pokemon._id,
        name: pokemon.name,
        types: pokemon.data.types,
        sprites: pokemon.data.sprites,
        abilities: pokemon.data.abilities,
        stats: pokemon.data.stats,
        createdAt: pokemon.createdAt
      };

      res.status(200).json(formattedPokemon);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza um Pokémon pelo ID
   * @param req Requisição Express
   * @param res Resposta Express
   * @param next Função para passar para o próximo middleware
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!id) {
        next(createError('ID do Pokémon é obrigatório', 400));
        return;
      }

      if (!name || typeof name !== 'string') {
        next(createError('Nome ou ID do novo Pokémon é obrigatório', 400));
        return;
      }

      const updatedPokemon = await this.pokemonService.updatePokemon(id, name);

      // Formata o Pokémon para retornar apenas os campos necessários
      const formattedPokemon = {
        id: updatedPokemon._id,
        name: updatedPokemon.name,
        types: updatedPokemon.data.types,
        sprites: updatedPokemon.data.sprites,
        abilities: updatedPokemon.data.abilities,
        stats: updatedPokemon.data.stats,
        updatedAt: updatedPokemon.updatedAt
      };

      res.status(200).json({
        message: `Pokémon atualizado com sucesso para ${updatedPokemon.name}`,
        pokemon: formattedPokemon
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cria um novo Pokémon
   * @param req Requisição Express
   * @param res Resposta Express
   * @param next Função para passar para o próximo middleware
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Valida o corpo da
      // requisição
      const { name } = req.body;

      if (!name || typeof name !== 'string') {
        next(createError('Nome ou ID do Pokémon é obrigatório', 400));
        return;
      }

      // Cria o Pokémon
      const pokemon = await this.pokemonService.createPokemon(name);

      res.status(201).json({
        message: `Pokémon ${pokemon.name} cadastrado com sucesso`,
        pokemon: {
          id: pokemon._id,
          name: pokemon.name,
          // Retornamos apenas algumas informações básicas do Pokémon
          // para não sobrecarregar a resposta
          types: pokemon.data.types,
          sprites: pokemon.data.sprites,
          abilities: pokemon.data.abilities,
          stats: pokemon.data.stats,
          createdAt: pokemon.createdAt
        }
      });
    } catch (error) {
      // Tratamento de erros específicos
      if (error instanceof Error) {
        if (error.message.includes('já está cadastrado')) {
          next(createError(error.message, 409));
          return;
        }

        if (error.message.includes('não encontrado')) {
          next(createError(error.message, 404));
          return;
        }
      }

      // Erro genérico
      console.error('Erro ao criar Pokémon:', error);
      next(createError('Erro interno do servidor', 500));
    }
  }
}
