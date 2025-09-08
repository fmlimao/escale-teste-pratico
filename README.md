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

## Recursos de IA

### Integração com IA para Informações Contextuais

O projeto inclui uma integração com um serviço de IA que fornece informações interessantes sobre os Pokémons:

- **Funcionamento**: Ao adicionar ou editar um Pokémon, uma requisição é enviada para um webhook que processa o nome do Pokémon e retorna informações geradas por IA.
- **Exibição**: As informações são exibidas em um componente especial no topo da listagem, com estilo diferenciado.
- **Tolerância a falhas**: A integração foi implementada de forma resiliente, não afetando o funcionamento principal do aplicativo caso o serviço de IA esteja indisponível.
- **Webhook**: `https://n8n.projetosfm.com.br/webhook/escale-pokemon`

### Chatbot Assistente Pokémon com IA Avançada

O projeto também inclui um chatbot assistente com IA avançada que ajuda os usuários a interagir com sua coleção de Pokémons:

- **Funcionalidades**:
  - Responde a perguntas sobre Pokémons específicos (tipos, habilidades, estatísticas)
  - Fornece informações sobre a coleção do usuário
  - Processa linguagem natural para entender diferentes formas de perguntas
  - Oferece sugestões de perguntas para facilitar o início da interação
  - Análise contextual da coleção completa do usuário

- **Tecnologia**:
  - Processamento de linguagem natural para interpretar perguntas
  - Integração com webhook de IA avançada que recebe a coleção completa do usuário
  - Respostas contextuais baseadas no conhecimento específico dos Pokémons do usuário
  - Interface de chat interativa e responsiva
  - Sistema de fallback em camadas para garantir sempre uma resposta útil
  - Webhook: `https://n8n.projetosfm.com.br/webhook/escale-chatbot`

- **Experiência do usuário**:
  - Botão flutuante para acesso rápido
  - Mensagens de boas-vindas e ajuda
  - Indicador de digitação para feedback visual
  - Design alinhado com a identidade visual do aplicativo
  - Respostas personalizadas baseadas na coleção específica do usuário

## Decisões de Arquitetura

### Backend

1. **Arquitetura em Camadas (MVC+)**:
   - **Controllers**: Responsáveis pela manipulação das requisições HTTP e respostas.
   - **Services**: Contêm a lógica de negócio e orquestram as operações.
   - **Models**: Definem a estrutura dos dados e interagem com o banco de dados.
   - **Middlewares**: Processam requisições antes de chegarem aos controllers.
   - **Routes**: Definem os endpoints da API e conectam às funções do controller.
   - **Utils**: Funções utilitárias reutilizáveis.

2. **Injeção de Dependências Simplificada**:
   - Serviços são instanciados e injetados nos controllers, facilitando os testes unitários.
   - Redução do acoplamento entre componentes.

3. **Tratamento Centralizado de Erros**:
   - Middleware global para capturar e formatar erros.
   - Função utilitária `createError` para padronizar a estrutura de erros.

4. **Validação de Dados**:
   - Validação de entrada nos controllers antes de processar a requisição.
   - Feedback claro ao usuário sobre problemas nos dados enviados.

5. **Documentação Automática**:
   - Swagger integrado diretamente no código via JSDoc.
   - Facilita a manutenção da documentação junto com o código.

### Frontend

1. **Arquitetura Baseada em Componentes**:
   - Componentes Vue.js reutilizáveis e modulares.
   - Separação clara entre apresentação (templates), lógica (script) e estilo (CSS).

2. **Gerenciamento de Estado Centralizado**:
   - Pinia para gerenciar o estado global da aplicação.
   - Ações, estados e getters bem definidos.

3. **Comunicação com API**:
   - Serviço dedicado para comunicação com o backend.
   - Tratamento padronizado de erros e respostas.

4. **Responsividade**:
   - Design adaptável a diferentes tamanhos de tela.
   - Uso de CSS flexbox e media queries.

5. **Integração com IA**:
   - Arquitetura resiliente que não compromete a funcionalidade principal em caso de falhas.
   - Separação clara entre a lógica de IA e a lógica principal da aplicação.

## Melhorias Futuras

### Backend

1. **Autenticação e Autorização**:
   - Implementar JWT para autenticação de usuários.
   - Adicionar níveis de permissão para diferentes operações.

2. **Cache**:
   - Implementar cache para consultas frequentes à PokeAPI.
   - Reduzir o número de requisições externas e melhorar o desempenho.

3. **Paginação e Filtros Avançados**:
   - Adicionar paginação na listagem de Pokémons.
   - Implementar filtros por tipo, habilidades, estatísticas, etc.

4. **Logging e Monitoramento**:
   - Adicionar um sistema de logging mais robusto.
   - Implementar monitoramento de performance e erros.

5. **Migração para GraphQL**:
   - Considerar a migração para GraphQL para consultas mais flexíveis.

### Frontend

1. **Tema Escuro/Claro**:
   - Implementar alternância entre temas escuro e claro.
   - Persistir a preferência do usuário.

2. **Internacionalização (i18n)**:
   - Suporte para múltiplos idiomas.

3. **PWA (Progressive Web App)**:
   - Transformar a aplicação em uma PWA para melhor experiência mobile.
   - Adicionar funcionalidades offline.

4. **Animações e Transições**:
   - Melhorar as animações entre estados da aplicação.
   - Adicionar transições mais suaves entre páginas.

5. **Pesquisa Avançada**:
   - Implementar busca por vários critérios (tipo, habilidades, etc).
   - Adicionar autocomplete na busca.

6. **Métricas de Usuário**:
   - Implementar análise de uso para entender melhor o comportamento do usuário.
   
7. **Chatbot Assistente**:
   - Chatbot interativo para ajudar com informações sobre Pokémons
   - Processamento de linguagem natural para entender perguntas
   - Respostas contextuais baseadas na coleção do usuário
   - Sugestões de perguntas para facilitar a interação

## Observações

- O projeto foi desenvolvido com foco em boas práticas de código, como Clean Code e SOLID
- A arquitetura segue o padrão MVC no backend
- O frontend utiliza componentes modulares e reutilizáveis
- Todos os endpoints da API são documentados com Swagger
- Implementação completa de testes unitários tanto no backend quanto no frontend
- Integração com IA para fornecer uma experiência diferenciada ao usuário
- Chatbot assistente para interação conversacional com a coleção de Pokémons
