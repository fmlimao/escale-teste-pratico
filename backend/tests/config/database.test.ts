import mongoose from 'mongoose';
import { connectDB } from '../../src/config/database';

// Mock do mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn()
}));

describe('Database Connection', () => {
  // Backup do console.log e console.error originais
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalProcessExit = process.exit;

  beforeEach(() => {
    // Mock do console.log e console.error para os testes
    console.log = jest.fn();
    console.error = jest.fn();
    process.exit = jest.fn() as any;

    // Limpa os mocks entre os testes
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restaura o console.log e console.error originais
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    process.exit = originalProcessExit;
  });

  it('deve conectar ao MongoDB com sucesso', async () => {
    // Mock da função connect para retornar sucesso
    (mongoose.connect as jest.Mock).mockResolvedValueOnce(undefined);

    // Define a variável de ambiente MONGO_URI
    const originalEnv = process.env;
    process.env.MONGO_URI = 'mongodb://test:27017/test-db';

    // Executa a função connectDB
    await connectDB();

    // Verifica se mongoose.connect foi chamado com a URI correta
    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://test:27017/test-db');

    // Verifica se a mensagem de sucesso foi logada
    expect(console.log).toHaveBeenCalledWith('Conexão com MongoDB estabelecida com sucesso');

    // Restaura as variáveis de ambiente
    process.env = originalEnv;
  });

  it('deve usar a URI padrão se MONGO_URI não estiver definido', async () => {
    // Mock da função connect para retornar sucesso
    (mongoose.connect as jest.Mock).mockResolvedValueOnce(undefined);

    // Remove a variável de ambiente MONGO_URI
    const originalEnv = process.env;
    delete process.env.MONGO_URI;

    // Executa a função connectDB
    await connectDB();

    // Verifica se mongoose.connect foi chamado com a URI padrão
    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://mongodb:27017/escale-app');

    // Restaura as variáveis de ambiente
    process.env = originalEnv;
  });

  it('deve tratar erros de conexão corretamente', async () => {
    // Mock da função connect para lançar um erro
    const error = new Error('Erro de conexão');
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(error);

    // Executa a função connectDB
    await connectDB();

    // Verifica se o erro foi logado
    expect(console.error).toHaveBeenCalledWith('Erro ao conectar ao MongoDB:', error);

    // Verifica se process.exit foi chamado com código 1
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
