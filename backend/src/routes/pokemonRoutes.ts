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
/* istanbul ignore next */
router.post('/', (req, res, next) => pokemonController.create(req, res, next));

export default router;
