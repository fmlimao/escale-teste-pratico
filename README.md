# Teste Prático da Escale - Pokedex

## Objetivo

Este projeto é um MVP (Minimum Viable Product) de uma Pokedex com as seguintes funcionalidades:

- Cadastrar Pokémon
- Listar Pokémon
- Visualizar detalhes de um Pokémon
- Editar um Pokémon
- Deletar um Pokémon

## Tecnologias Utilizadas

### Backend

- **Node.js**: Ambiente de execução JavaScript
- **Express.js**: Framework web para Node.js
- **TypeScript**: Superset tipado de JavaScript
- **MongoDB**: Banco de dados NoSQL
- **Mongoose**: ODM (Object Data Modeling) para MongoDB
- **Jest**: Framework de testes
- **Swagger**: Documentação da API
- **Docker**: Containerização da aplicação

### Frontend

- **Vue.js 3**: Framework JavaScript progressivo
- **TypeScript**: Superset tipado de JavaScript
- **Pinia**: Gerenciador de estado para Vue.js
- **Docker**: Containerização da aplicação

### API Externa

- **PokeAPI**: https://pokeapi.co/docs/v2 - Utilizada para buscar dados dos Pokémon

## Pré-requisitos

- Docker e Docker Compose instalados
- Git instalado (para clonar o repositório)

## Instalação e Execução

### Clonando o Repositório

```bash
git clone https://github.com/lmacedo/escale-teste-pratico.git
cd escale-teste-pratico
```

### Executando com Docker

1. Inicie os contêineres com Docker Compose:

```bash
docker-compose up -d
```

2. A aplicação estará disponível em:
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3000
   - **Documentação Swagger**: http://localhost:3000/api-docs

### Parando a Aplicação

```bash
docker-compose down
```

## Executando Testes

Para executar os testes do backend:

```bash
cd backend
npm test
```

Para executar os testes do frontend:

```bash
cd frontend
npm test          # Executa todos os testes
npm run test:store  # Executa apenas os testes do store Pinia
npm run test:watch  # Executa os testes em modo de observação (watch mode)
```

Para executar os testes com cobertura:

```bash
cd backend
npm run test:coverage
```

## Estrutura do Projeto

### Backend

```
backend/
├── src/
│   ├── config/           # Configurações (banco de dados, swagger)
│   ├── controllers/      # Controladores da API
│   ├── middlewares/      # Middlewares do Express
│   ├── models/           # Modelos do Mongoose
│   ├── routes/           # Rotas da API
│   ├── services/         # Serviços de negócio
│   └── index.ts          # Ponto de entrada da aplicação
├── tests/                # Testes unitários
├── .env                  # Variáveis de ambiente
├── .env.example          # Exemplo de variáveis de ambiente
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração do TypeScript
├── jest.config.js        # Configuração do Jest
└── Dockerfile            # Configuração do Docker
```

### Frontend

```
frontend/
├── src/
│   ├── assets/           # Recursos estáticos
│   ├── components/       # Componentes Vue
│   ├── services/         # Serviços para comunicação com a API
│   ├── stores/           # Stores do Pinia
│   ├── __tests__/        # Testes unitários
│   │   ├── components/   # Testes de componentes
│   │   └── stores/       # Testes de stores
│   ├── App.vue           # Componente raiz
│   ├── main.ts           # Ponto de entrada da aplicação
│   └── style.css         # Estilos globais
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração do TypeScript
├── vitest.config.ts      # Configuração do Vitest
└── Dockerfile            # Configuração do Docker
```

## API Endpoints

### Documentação Swagger

A documentação completa da API está disponível em: http://localhost:3000/api-docs

### Endpoints Principais

- **POST /api/pokemons** - Cadastrar um Pokémon
  - Body: `{ "name": "pikachu" }`

- **GET /api/pokemons** - Listar todos os Pokémon (ordenados por ID)
  - Response: Lista de Pokémon com seus dados, ordenados pelo ID numérico do Pokémon

- **GET /api/pokemons/:id** - Visualizar detalhes de um Pokémon
  - Response: Dados completos do Pokémon

- **PUT /api/pokemons/:id** - Editar um Pokémon
  - Body: `{ "name": "charizard" }`

- **DELETE /api/pokemons/:id** - Deletar um Pokémon
  - Response: Mensagem de sucesso

## Funcionalidades Implementadas

### Backend

1. **CRUD completo de Pokémon**:
   - Criação: Busca dados na PokeAPI e salva no MongoDB
   - Leitura: Lista todos os Pokémon (ordenados por ID) ou busca por ID
   - Atualização: Edita um Pokémon existente
   - Exclusão: Remove um Pokémon do banco de dados

2. **Validações**:
   - Verifica se o Pokémon existe na PokeAPI
   - Verifica se o Pokémon já está cadastrado
   - Validação de IDs e parâmetros

3. **Tratamento de Erros**:
   - Middleware para erros 404 (Not Found)
   - Middleware para erros 500 (Internal Server Error)
   - Respostas de erro padronizadas

4. **Testes**:
   - Testes unitários com Jest
   - Cobertura de código de 100%

### Frontend

1. **Interface de Usuário**:
   - Lista de Pokémon com imagens e informações básicas
   - Modal para visualização detalhada
   - Formulário para adicionar novos Pokémon
   - Botão para excluir Pokémon

2. **Gerenciamento de Estado**:
   - Pinia para gerenciamento centralizado do estado
   - Componentes reutilizáveis

3. **Comunicação com API**:
   - Serviço para comunicação com o backend
   - Tratamento de erros e feedback ao usuário

4. **Responsividade**:
   - Layout adaptável para diferentes tamanhos de tela

5. **Testes**:
   - Testes unitários com Vitest
   - Testes para o store Pinia (100% de cobertura)
   - Testes para componentes Vue
   - Mocks para serviços de API
   - Testes de interação do usuário
   
6. **Integração com IA**:
   - Informações geradas por IA sobre cada Pokémon
   - Exibição de curiosidades ao adicionar ou editar Pokémons
   - Integração com webhook externo para processamento de IA

## Detalhes dos Testes

### Backend

- Testes unitários com Jest
- 100% de cobertura de código
- Testes para controllers, services, middlewares e models
- Mocks para o banco de dados e serviços externos
- Testes de integração para os endpoints da API

### Frontend

- Testes unitários com Vitest
- Testes para o store Pinia com 100% de cobertura
- Mocks para serviços de API
- Testes de componentes com @vue/test-utils
- Testes de interação do usuário (cliques, formulários, etc.)

## Integração com IA

O projeto inclui uma integração com um serviço de IA que fornece informações interessantes sobre os Pokémons:

- **Funcionamento**: Ao adicionar ou editar um Pokémon, uma requisição é enviada para um webhook que processa o nome do Pokémon e retorna informações geradas por IA.
- **Exibição**: As informações são exibidas em um componente especial no topo da listagem, com estilo diferenciado.
- **Tolerância a falhas**: A integração foi implementada de forma resiliente, não afetando o funcionamento principal do aplicativo caso o serviço de IA esteja indisponível.
- **Webhook**: `https://n8n.projetosfm.com.br/webhook/escale-pokemon`

## Observações

- O projeto foi desenvolvido com foco em boas práticas de código, como Clean Code e SOLID
- A arquitetura segue o padrão MVC no backend
- O frontend utiliza componentes modulares e reutilizáveis
- Todos os endpoints da API são documentados com Swagger
- Implementação completa de testes unitários tanto no backend quanto no frontend
- Integração com IA para fornecer uma experiência diferenciada ao usuário
