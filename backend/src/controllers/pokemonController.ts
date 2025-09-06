import { Request, Response } from 'express';
import { PokemonService } from '../services/pokemonService';

/**
 * Controller para gerenciar as requisições relacionadas a Pokémons
 */
export class PokemonController {
  private pokemonService: PokemonService;

  constructor() {
    this.pokemonService = new PokemonService();
  }

  /**
   * Cria um novo Pokémon
   * @param req Requisição Express
   * @param res Resposta Express
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      // Valida o corpo da
      // requisição
      const { name } = req.body;

      if (!name || typeof name !== 'string') {
        res.status(400).json({ error: 'Nome ou ID do Pokémon é obrigatório' });
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
          res.status(409).json({ error: error.message });
          return;
        }

        if (error.message.includes('não encontrado')) {
          res.status(404).json({ error: error.message });
          return;
        }
      }

      // Erro genérico
      console.error('Erro ao criar Pokémon:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
