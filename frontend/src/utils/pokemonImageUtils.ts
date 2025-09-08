/**
 * Utilitário para gerenciar imagens de Pokémons
 */

/**
 * Retorna a URL da imagem do Pokémon, com 50% de chance de ser a versão shiny
 * se a mesma estiver disponível
 * 
 * @param sprites Objeto sprites do Pokémon
 * @returns URL da imagem (normal ou shiny)
 */
export function getPokemonImageUrl(sprites: { front_default?: string, front_shiny?: string, [key: string]: any }): string {
  // Imagem padrão caso nenhuma esteja disponível
  const defaultImage = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
  
  // Se não tiver imagem normal, retorna a imagem padrão
  if (!sprites?.front_default) {
    return defaultImage;
  }
  
  // Se não tiver imagem shiny, retorna a normal
  if (!sprites?.front_shiny) {
    return sprites.front_default;
  }
  
  // 50% de chance de retornar a imagem shiny
  const useShiny = Math.random() < 0.5;
  
  return useShiny ? sprites.front_shiny : sprites.front_default;
}
