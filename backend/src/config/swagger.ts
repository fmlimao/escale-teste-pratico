import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Escale Teste Prático',
      version,
      description: 'Documentação da API do teste prático da Escale',
      contact: {
        name: 'Suporte',
        url: 'https://escale.com.br',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/index.ts'], // Arquivos contendo anotações do Swagger
};

export const specs = swaggerJsdoc(options);
