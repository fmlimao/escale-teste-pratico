import { Request, Response, NextFunction } from 'express';
import { notFoundMiddleware, errorMiddleware, createError, AppError } from '../../src/middlewares/errorMiddleware';

describe('Error Middlewares', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;

  beforeEach(() => {
    mockRequest = {
      originalUrl: '/test-url'
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('notFoundMiddleware', () => {
    it('deve retornar status 404 com mensagem de erro', () => {
      // Executa o middleware
      notFoundMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      // Verifica se status e json foram chamados corretamente
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          code: 404,
          message: 'Rota não encontrada: /test-url'
        }
      });
    });
  });

  describe('errorMiddleware', () => {
    it('deve retornar o status code e mensagem do erro', () => {
      // Cria um erro com statusCode
      const error: AppError = new Error('Erro de teste');
      error.statusCode = 400;

      // Executa o middleware
      errorMiddleware(
        error,
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      // Verifica se status e json foram chamados corretamente
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          code: 400,
          message: 'Erro de teste'
        }
      });
    });

    it('deve usar status 500 quando o erro não tem statusCode', () => {
      // Cria um erro sem statusCode
      const error = new Error('Erro interno') as AppError;

      // Mock do console.error para evitar logs nos testes
      const originalConsoleError = console.error;
      console.error = jest.fn();

      // Executa o middleware
      errorMiddleware(
        error,
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      // Verifica se status e json foram chamados corretamente
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          code: 500,
          message: 'Erro interno'
        }
      });

      // Restaura console.error
      console.error = originalConsoleError;
    });

    it('deve usar mensagem genérica em produção para erros 500', () => {
      // Salva o NODE_ENV original
      const originalNodeEnv = process.env.NODE_ENV;
      
      // Define NODE_ENV como production
      process.env.NODE_ENV = 'production';
      
      // Cria um erro com statusCode 500
      const error: AppError = new Error('Detalhes do erro interno');
      error.statusCode = 500;

      // Executa o middleware
      errorMiddleware(
        error,
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      // Verifica se status e json foram chamados corretamente
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          code: 500,
          message: 'Erro interno do servidor'
        }
      });
      
      // Restaura o NODE_ENV original
      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('createError', () => {
    it('deve criar um erro com a mensagem e statusCode fornecidos', () => {
      const error = createError('Erro de teste', 400);
      
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Erro de teste');
      expect(error.statusCode).toBe(400);
    });
  });
});
