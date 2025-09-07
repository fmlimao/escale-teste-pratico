import { Request, Response, NextFunction } from 'express';
import { PokemonController } from '../../src/controllers/pokemonController';
import { PokemonService } from '../../src/services/pokemonService';
import { createError } from '../../src/middlewares/errorMiddleware';

// Mock do PokemonService
jest.mock('../../src/services/pokemonService');
jest.mock('../../src/middlewares/errorMiddleware');

describe('PokemonController', () => {
  let pokemonController: PokemonController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let mockPokemonService: jest.Mocked<PokemonService>;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock do PokemonService
    mockPokemonService = {
      createPokemon: jest.fn(),
      fetchPokemonFromAPI: jest.fn(),
      pokemonExists: jest.fn(),
      findAllPokemons: jest.fn()
    } as unknown as jest.Mocked<PokemonService>;
    
    // Substitui o construtor do PokemonService para retornar nosso mock
    (PokemonService as jest.Mock).mockImplementation(() => mockPokemonService);
    
    // Mock da função createError
    (createError as jest.Mock) = jest.fn().mockImplementation((message, statusCode) => {
      const error = new Error(message);
      (error as any).statusCode = statusCode;
      return error;
    });
    
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
    
    // Mock da função next
    mockNext = jest.fn();
  });
  
  describe('create', () => {
    it('deve chamar next com erro 400 quando o nome não é fornecido', async () => {
      // Configura o mock request sem nome
      mockRequest.body = {};
      
      // Chama o método create
      await pokemonController.create(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
      
      // Verifica se next foi chamado com o erro correto
      expect(mockNext).toHaveBeenCalled();
      expect(createError).toHaveBeenCalledWith('Nome ou ID do Pokémon é obrigatório', 400);
      
      // Verifica se o serviço não foi chamado
      expect(mockPokemonService.createPokemon).not.toHaveBeenCalled();
    });
    
    it('deve chamar next com erro 400 quando o nome não é uma string', async () => {
      // Configura o mock request com nome não-string
      mockRequest.body = { name: 123 };
      
      // Chama o método create
      await pokemonController.create(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
      
      // Verifica se next foi chamado com o erro correto
      expect(mockNext).toHaveBeenCalled();
      expect(createError).toHaveBeenCalledWith('Nome ou ID do Pokémon é obrigatório', 400);
      
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
      await pokemonController.create(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
      
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
    
    it('deve chamar next com erro 409 quando o Pokémon já existe', async () => {
      // Configura o mock request com nome válido
      mockRequest.body = { name: 'pikachu' };
      
      // Mock do erro de Pokémon já existente
      const error = new Error('Pokémon pikachu já está cadastrado');
      mockPokemonService.createPokemon.mockRejectedValueOnce(error);
      
      // Chama o método create
      await pokemonController.create(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
      
      // Verifica se next foi chamado com o erro correto
      expect(mockNext).toHaveBeenCalled();
      expect(createError).toHaveBeenCalledWith('Pokémon pikachu já está cadastrado', 409);
    });
    
    it('deve chamar next com erro 404 quando o Pokémon não é encontrado na API', async () => {
      // Configura o mock request com nome válido
      mockRequest.body = { name: 'invalid-pokemon' };
      
      // Mock do erro de Pokémon não encontrado
      const error = new Error('Pokémon invalid-pokemon não encontrado na PokeAPI');
      mockPokemonService.createPokemon.mockRejectedValueOnce(error);
      
      // Chama o método create
      await pokemonController.create(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
      
      // Verifica se next foi chamado com o erro correto
      expect(mockNext).toHaveBeenCalled();
      expect(createError).toHaveBeenCalledWith('Pokémon invalid-pokemon não encontrado na PokeAPI', 404);
    });
    
    it('deve chamar next com erro 500 para erros genéricos', async () => {
      // Configura o mock request com nome válido
      mockRequest.body = { name: 'pikachu' };
      
      // Mock de um erro genérico
      const error = new Error('Erro interno');
      mockPokemonService.createPokemon.mockRejectedValueOnce(error);
      
      // Mock do console.error para evitar logs nos testes
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      // Chama o método create
      await pokemonController.create(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
      
      // Verifica se next foi chamado com o erro correto
      expect(mockNext).toHaveBeenCalled();
      expect(createError).toHaveBeenCalledWith('Erro interno do servidor', 500);
      
      // Verifica se o erro foi logado
      expect(console.error).toHaveBeenCalledWith('Erro ao criar Pokémon:', error);
      
      // Restaura console.error
      console.error = originalConsoleError;
    });
  });
  
  describe('findAll', () => {
    it('deve retornar a lista de Pokémons com sucesso', async () => {
      // Mock da lista de Pokémons
      const mockPokemons = [
        {
          _id: 'mock-id-1',
          name: 'pikachu',
          data: {
            name: 'pikachu',
            types: [{ slot: 1, type: { name: 'electric' } }],
            sprites: { front_default: 'url-to-sprite-1' },
            abilities: [{ ability: { name: 'static' } }],
            stats: [{ base_stat: 35, stat: { name: 'hp' } }]
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: 'mock-id-2',
          name: 'bulbasaur',
          data: {
            name: 'bulbasaur',
            types: [{ slot: 1, type: { name: 'grass' } }],
            sprites: { front_default: 'url-to-sprite-2' },
            abilities: [{ ability: { name: 'overgrow' } }],
            stats: [{ base_stat: 45, stat: { name: 'hp' } }]
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      mockPokemonService.findAllPokemons.mockResolvedValueOnce(mockPokemons as any);
      
      // Chama o método findAll
      await pokemonController.findAll(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
      
      // Verifica se o serviço foi chamado
      expect(mockPokemonService.findAllPokemons).toHaveBeenCalled();
      
      // Verifica se status e json foram chamados corretamente
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        count: 2,
        pokemons: expect.arrayContaining([
          expect.objectContaining({
            id: 'mock-id-1',
            name: 'pikachu'
          }),
          expect.objectContaining({
            id: 'mock-id-2',
            name: 'bulbasaur'
          })
        ])
      });
    });
    
    it('deve chamar next com o erro quando ocorre uma exceção', async () => {
      // Mock de erro
      const error = new Error('Erro ao buscar Pokémons');
      mockPokemonService.findAllPokemons.mockRejectedValueOnce(error);
      
      // Chama o método findAll
      await pokemonController.findAll(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
      
      // Verifica se next foi chamado com o erro
      expect(mockNext).toHaveBeenCalledWith(error);
      
      // Verifica se status e json não foram chamados
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});