import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './config/database';
import { specs } from './config/swagger';
import pokemonRoutes from './routes/pokemonRoutes';
import { notFoundMiddleware, errorMiddleware } from './middlewares/errorMiddleware';

// Configuração do ambiente
dotenv.config();

// Inicialização do app
const app = express();
/* istanbul ignore next */
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retorna uma mensagem de Hello World
 *     description: Rota inicial para verificar se a API está funcionando
 *     responses:
 *       200:
 *         description: Mensagem de sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello World!
 */
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Rotas da API
app.use('/api/pokemons', pokemonRoutes);

// Middleware para rotas não encontradas (404)
// Deve ser adicionado após todas as rotas
app.use(notFoundMiddleware);

// Middleware para tratamento de erros
// Deve ser o último middleware a ser adicionado
app.use(errorMiddleware);

// Iniciar servidor
const startServer = async (expressApp = app, port = PORT) => {
  try {
    // Conectar ao MongoDB
    await connectDB();

    expressApp.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
      console.log(`Documentação Swagger disponível em http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Função auxiliar para iniciar o servidor (para facilitar os testes)
export const initServer = () => {
  // Iniciar o servidor apenas se não estiver em ambiente de teste
  const shouldStartServer = process.env.NODE_ENV !== 'test';
  /* istanbul ignore next */
  if (shouldStartServer) {
    startServer();
  }
  return shouldStartServer;
};

// Inicializa o servidor
/* istanbul ignore next */
initServer();

// Para testes
export default Object.assign(app, {
  __test__: {
    startServer,
    initServer,
    PORT
  }
});
