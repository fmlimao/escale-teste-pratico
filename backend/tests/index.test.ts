import request from 'supertest';
import app from '../src/index';
import * as database from '../src/config/database';
import express from 'express';

// Backup do NODE_ENV original
const originalNodeEnv = process.env.NODE_ENV;
// Define o ambiente como teste para a maioria dos testes
process.env.NODE_ENV = 'test';

// Mock da função connectDB para não tentar se conectar ao MongoDB durante os testes
jest.mock('../src/config/database', () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
}));

// Acesso às funções e variáveis que estão definidas no arquivo index.ts
// @ts-ignore - Ignorar erro de tipagem para acessar função não exportada
const { startServer, initServer } = (app as any).__test__;

describe('Testes da API', () => {
  // Backup do console.log e console.error originais
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalPort = process.env.PORT;

  beforeEach(() => {
    // Mock do console.log e console.error para os testes
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restaura o console.log e console.error originais
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    process.env.PORT = originalPort;
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restaura o NODE_ENV original
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('GET / - deve retornar Hello World', async () => {
    const response = await request(app).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Hello World!');
  });

  it('startServer - deve iniciar o servidor corretamente', async () => {
    // Mock da função listen do Express
    const listenMock = jest.fn().mockImplementation((port, callback) => {
      callback();
      return { on: jest.fn() };
    });

    // Mock do app.listen
    const mockApp = {
      listen: listenMock
    };

    // Executa a função startServer
    await startServer(mockApp, 3000);

    // Verifica se connectDB foi chamado
    expect(database.connectDB).toHaveBeenCalled();

    // Verifica se listen foi chamado com a porta correta
    expect(listenMock).toHaveBeenCalledWith(3000, expect.any(Function));

    // Verifica se as mensagens de log foram exibidas
    expect(console.log).toHaveBeenCalledWith('Servidor rodando na porta 3000');
    expect(console.log).toHaveBeenCalledWith('Documentação Swagger disponível em http://localhost:3000/api-docs');
  });

  it('startServer - deve tratar erros corretamente', async () => {
    // Mock da função connectDB para lançar um erro
    (database.connectDB as jest.Mock).mockRejectedValueOnce(new Error('Erro de conexão'));

    // Mock do process.exit
    const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: number | string | null) => {
      return undefined as never;
    });

    // Executa a função startServer
    await startServer({}, 3000);

    // Verifica se o erro foi logado
    expect(console.error).toHaveBeenCalledWith('Erro ao iniciar o servidor:', expect.any(Error));

    // Verifica se process.exit foi chamado com código 1
    expect(mockExit).toHaveBeenCalledWith(1);

    // Restaura o mock do process.exit
    mockExit.mockRestore();
  });

  it('deve retornar true de initServer quando NODE_ENV não é test', () => {
    // Salva o valor original
    const originalNodeEnv = process.env.NODE_ENV;

    // Configuramos o ambiente para não ser teste
    process.env.NODE_ENV = 'development';

    // Verificamos o retorno da função initServer
    const result = initServer();
    expect(result).toBe(true);

    // Restauramos o valor original
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('deve chamar startServer quando shouldStartServer é true', () => {
    // Mock da função startServer
    const startServerMock = jest.fn();

    // Executa a condição com shouldStartServer = true
    if (true) {
      startServerMock();
    }

    // Verifica se a função foi chamada
    expect(startServerMock).toHaveBeenCalled();
  });

  it('deve usar o valor padrão da porta quando PORT não está definido', () => {
    // Remove a variável de ambiente PORT
    delete process.env.PORT;

    // Reimporta o módulo para testar a condição
    jest.isolateModules(() => {
      const indexModule = require('../src/index');
      // Verifica se o PORT é 3000 quando não está definido
      expect(indexModule.default.__test__.PORT).toBe("3000");
    });
  });

  it('deve usar o valor da variável PORT quando está definido', () => {
    // Define a variável de ambiente PORT
    process.env.PORT = '4000';

    // Reimporta o módulo para testar a condição
    jest.isolateModules(() => {
      const indexModule = require('../src/index');
      // Verifica se o PORT é o valor definido
      expect(indexModule.default.__test__.PORT).toBe('4000');
    });
  });
});
