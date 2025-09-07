import { Request, Response, NextFunction } from 'express';

/**
 * Interface para erros personalizados com código HTTP
 */
export interface AppError extends Error {
  statusCode?: number;
}

/**
 * Middleware para lidar com rotas não encontradas (404)
 */
export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    error: {
      code: 404,
      message: `Rota não encontrada: ${req.originalUrl}`
    }
  });
};

/**
 * Middleware para lidar com erros (500 e outros)
 */
export const errorMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
  // Se o erro já tiver um código de status, use-o; caso contrário, use 500
  const statusCode = err.statusCode || 500;
  
  // Determinar a mensagem de erro
  /* istanbul ignore next */
  let message = err.message || 'Erro interno do servidor';
  
  // Em ambiente de produção, não envie detalhes de erros internos
  /* istanbul ignore next */
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Erro interno do servidor';
  }
  
  // Log do erro (apenas em ambiente de desenvolvimento ou homologação)
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Erro ${statusCode}] ${err.stack || err}`);
  }
  
  // Enviar resposta de erro
  res.status(statusCode).json({
    error: {
      code: statusCode,
      message
    }
  });
};

/**
 * Função para criar um erro com código de status HTTP
 */
export const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  return error;
};
