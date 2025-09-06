# Teste prático da Escale

## Objetivo

Criar um MVP de uma Pokedex com as seguintes funcionalidades:

- Cadastrar Pokémon
- Listar Pokémon
- Visualizar detalhes de um Pokémon
- Editar um Pokémon
- Deletar um Pokémon

## Tecnologias

### API

Node.js com Express.js e TypeScript, com MongoDB como banco de dados e Jest para testes.

Usaremos a api https://pokeapi.co/docs/v2 para buscar os dados dos Pokémon.

### Frontend

Vue.js com Typescript.

### Documentação

Swagger para documentar a API.

### Rotas da API

- POST /pokemons - Cadastrar um Pokémon
- GET /pokemons - Listar todos os Pokémon
- GET /pokemons/:id - Visualizar detalhes de um Pokémon
- PUT /pokemons/:id - Editar um Pokémon
- DELETE /pokemons/:id - Deletar um Pokémon

### Rotas do Frontend

- GET / - Listar todos os Pokémon
- GET /pokemons/:id - Visualizar detalhes de um Pokémon
