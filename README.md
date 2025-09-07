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
│   ├── App.vue           # Componente raiz
│   ├── main.ts           # Ponto de entrada da aplicação
│   └── style.css         # Estilos globais
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração do TypeScript
└── Dockerfile            # Configuração do Docker
```

## API Endpoints

### Documentação Swagger

A documentação completa da API está disponível em: http://localhost:3000/api-docs

### Endpoints Principais

- **POST /api/pokemons** - Cadastrar um Pokémon
  - Body: `{ "name": "pikachu" }`

- **GET /api/pokemons** - Listar todos os Pokémon
  - Response: Lista de Pokémon com seus dados

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
   - Leitura: Lista todos os Pokémon ou busca por ID
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

## Observações

- O projeto foi desenvolvido com foco em boas práticas de código, como Clean Code e SOLID
- A arquitetura segue o padrão MVC no backend
- O frontend utiliza componentes modulares e reutilizáveis
- Todos os endpoints da API são documentados com Swagger
