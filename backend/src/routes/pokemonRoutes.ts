import express from 'express';
import { PokemonController } from '../controllers/pokemonController';

const router = express.Router();
const pokemonController = new PokemonController();

/**
 * @swagger
 * /api/pokemons:
 *   post:
 *     summary: Cadastra um novo Pokémon
 *     description: Busca um Pokémon pelo nome ou ID na PokeAPI e salva no banco de dados
 *     tags:
 *       - Pokémons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome ou ID do Pokémon a ser cadastrado
 *                 example: pikachu
 *     responses:
 *       201:
 *         description: Pokémon cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pokémon pikachu cadastrado com sucesso
 *                 pokemon:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     name:
 *                       type: string
 *                       example: pikachu
 *                     types:
 *                       type: array
 *                       items:
 *                         type: object
 *                     sprites:
 *                       type: object
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Requisição inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Nome ou ID do Pokémon é obrigatório
 *       404:
 *         description: Pokémon não encontrado na PokeAPI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Pokémon mewtwo123 não encontrado na PokeAPI
 *       409:
 *         description: Pokémon já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Pokémon pikachu já está cadastrado
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro interno do servidor
 */
/**
 * @swagger
 * /api/pokemons:
 *   get:
 *     summary: Lista todos os Pokémons cadastrados
 *     tags: [Pokemons]
 *     responses:
 *       200:
 *         description: Lista de Pokémons retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 pokemons:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 60d21b4667d0d8992e610c85
 *                       name:
 *                         type: string
 *                         example: pikachu
 *                       types:
 *                         type: array
 *                         items:
 *                           type: object
 *                       sprites:
 *                         type: object
 *                       abilities:
 *                         type: array
 *                         items:
 *                           type: object
 *                       stats:
 *                         type: array
 *                         items:
 *                           type: object
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 500
 *                     message:
 *                       type: string
 *                       example: Erro ao buscar Pokémons
 */
/* istanbul ignore next */
router.get('/', (req, res, next) => pokemonController.findAll(req, res, next));

/**
 * @swagger
 * /api/pokemons/{id}:
 *   get:
 *     summary: Busca um Pokémon pelo ID
 *     tags: [Pokemons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do Pokémon
 *     responses:
 *       200:
 *         description: Pokémon encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 60d21b4667d0d8992e610c85
 *                 name:
 *                   type: string
 *                   example: pikachu
 *                 types:
 *                   type: array
 *                   items:
 *                     type: object
 *                 sprites:
 *                   type: object
 *                 abilities:
 *                   type: array
 *                   items:
 *                     type: object
 *                 stats:
 *                   type: array
 *                   items:
 *                     type: object
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 400
 *                     message:
 *                       type: string
 *                       example: ID 123 inválido
 *       404:
 *         description: Pokémon não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 404
 *                     message:
 *                       type: string
 *                       example: Pokémon com ID 60d21b4667d0d8992e610c85 não encontrado
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 500
 *                     message:
 *                       type: string
 *                       example: Erro ao buscar Pokémon
 */
/* istanbul ignore next */
router.get('/:id', (req, res, next) => pokemonController.findById(req, res, next));

/**
 * @swagger
 * /api/pokemons/{id}:
 *   put:
 *     summary: Atualiza um Pokémon pelo ID
 *     tags: [Pokemons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do Pokémon a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome ou ID do novo Pokémon
 *     responses:
 *       200:
 *         description: Pokémon atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pokémon atualizado com sucesso para pikachu
 *                 pokemon:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     name:
 *                       type: string
 *                       example: pikachu
 *                     types:
 *                       type: array
 *                       items:
 *                         type: object
 *                     sprites:
 *                       type: object
 *                     abilities:
 *                       type: array
 *                       items:
 *                         type: object
 *                     stats:
 *                       type: array
 *                       items:
 *                         type: object
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: ID inválido ou nome não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 400
 *                     message:
 *                       type: string
 *                       example: Nome ou ID do novo Pokémon é obrigatório
 *       404:
 *         description: Pokémon não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 404
 *                     message:
 *                       type: string
 *                       example: Pokémon com ID 60d21b4667d0d8992e610c85 não encontrado
 *       409:
 *         description: Pokémon já cadastrado com outro ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 409
 *                     message:
 *                       type: string
 *                       example: Pokémon pikachu já está cadastrado com outro ID
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 500
 *                     message:
 *                       type: string
 *                       example: Erro ao atualizar Pokémon
 */
/* istanbul ignore next */
router.put('/:id', (req, res, next) => pokemonController.update(req, res, next));

/* istanbul ignore next */
router.post('/', (req, res, next) => pokemonController.create(req, res, next));

export default router;
