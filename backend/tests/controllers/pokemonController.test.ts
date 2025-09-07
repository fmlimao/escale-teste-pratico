import { Request, Response } from 'express';
import { PokemonController } from '../../src/controllers/pokemonController';
import { PokemonService } from '../../src/services/pokemonService';

// Mock do PokemonService
jest.mock('../../src/services/pokemonService');

describe('PokemonController', () => {
  let pokemonController: PokemonController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockPokemonService: jest.Mocked<PokemonService>;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock do PokemonService
    mockPokemonService = {
      createPokemon: jest.fn(),
      fetchPokemonFromAPI: jest.fn(),
      pokemonExists: jest.fn()
    } as unknown as jest.Mocked<PokemonService>;
    
    // Substitui o construtor do PokemonService para retornar nosso mock
    (PokemonService as jest.Mock).mockImplementation(() => mockPokemonService);
    
    // Cria uma nova instância do controller com o serviço mockado
    pokemonController = new PokemonController();
    
    // Mock do Request e Response
    mockRequest = {
      body: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  describe('create', () => {
    it('deve retornar erro 400 quando o nome não é fornecido', async () => {
      // Configura o mock request sem nome
      mockRequest.body = {};
      
      // Chama o método create
      await pokemonController.create(mockRequest as Request, mockResponse as Response);
      
      // Verifica se status e json foram chamados corretamente
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        error: 'Nome ou ID do Pokémon é obrigatório' 
      });
      
      // Verifica se o serviço não foi chamado
      expect(mockPokemonService.createPokemon).not.toHaveBeenCalled();
    });
    
    it('deve retornar erro 400 quando o nome não é uma string', async () => {
      // Configura o mock request com nome não-string
      mockRequest.body = { name: 123 };
      
      // Chama o método create
      await pokemonController.create(mockRequest as Request, mockResponse as Response);
      
      // Verifica se status e json foram chamados corretamente
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        error: 'Nome ou ID do Pokémon é obrigatório' 
      });
      
      // Verifica se o serviço não foi chamado
      expect(mockPokemonService.createPokemon).not.toHaveBeenCalled();
    });
    
    it('deve criar um Pokémon com sucesso', async () => {
      // Configura o mock request com nome válido
      mockRequest.body = { name: 'pikachu' };
      
      // Mock do resultado do serviço
      const mockPokemon = {
        _id: 'mock-id',
        name: 'pikachu',
        data: {
          name: 'pikachu',
          types: [{ slot: 1, type: { name: 'electric' } }],
          sprites: { front_default: 'url-to-sprite' },
          abilities: [{ ability: { name: 'static' } }],
          stats: [{ base_stat: 35, stat: { name: 'hp' } }]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockPokemonService.createPokemon.mockResolvedValueOnce(mockPokemon as any);
      
      // Chama o método create
      await pokemonController.create(mockRequest as Request, mockResponse as Response);
      
      // Verifica se o serviço foi chamado corretamente
      expect(mockPokemonService.createPokemon).toHaveBeenCalledWith('pikachu');
      
      // Verifica se status e json foram chamados corretamente
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: `Pokémon pikachu cadastrado com sucesso`,
        pokemon: {
          id: 'mock-id',
          name: 'pikachu',
          types: [{ slot: 1, type: { name: 'electric' } }],
          sprites: { front_default: 'url-to-sprite' },
          abilities: [{ ability: { name: 'static' } }],
          stats: [{ base_stat: 35, stat: { name: 'hp' } }],
          createdAt: expect.any(Date)
        }
      });
    });
    
    it('deve retornar erro 409 quando o Pokémon já existe', async () => {
      // Configura o mock request com nome válido
      mockRequest.body = { name: 'pikachu' };
      
      // Mock do erro de Pokémon já existente
      const error = new Error('Pokémon pikachu já está cadastrado');
      mockPokemonService.createPokemon.mockRejectedValueOnce(error);
      
      // Chama o método create
      await pokemonController.create(mockRequest as Request, mockResponse as Response);
      
      // Verifica se status e json foram chamados corretamente
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        error: 'Pokémon pikachu já está cadastrado' 
      });
    });
    
    it('deve retornar erro 404 quando o Pokémon não é encontrado na API', async () => {
      // Configura o mock request com nome válido
      mockRequest.body = { name: 'invalid-pokemon' };
      
      // Mock do erro de Pokémon não encontrado
      const error = new Error('Pokémon invalid-pokemon não encontrado na PokeAPI');
      mockPokemonService.createPokemon.mockRejectedValueOnce(error);
      
      // Chama o método create
      await pokemonController.create(mockRequest as Request, mockResponse as Response);
      
      // Verifica se status e json foram chamados corretamente
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        error: 'Pokémon invalid-pokemon não encontrado na PokeAPI' 
      });
    });
    
    it('deve retornar erro 500 para erros genéricos', async () => {
      // Configura o mock request com nome válido
      mockRequest.body = { name: 'pikachu' };
      
      // Mock de um erro genérico
      const error = new Error('Erro interno');
      mockPokemonService.createPokemon.mockRejectedValueOnce(error);
      
      // Mock do console.error para evitar logs nos testes
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      // Chama o método create
      await pokemonController.create(mockRequest as Request, mockResponse as Response);
      
      // Verifica se status e json foram chamados corretamente
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        error: 'Erro interno do servidor' 
      });
      
      // Verifica se o erro foi logado
      expect(console.error).toHaveBeenCalledWith('Erro ao criar Pokémon:', error);
      
      // Restaura console.error
      console.error = originalConsoleError;
    });
  });
});
