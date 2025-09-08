/**
 * Serviço para integração com IA via webhook
 */
const aiService = {
  /**
   * URL do webhook de IA
   */
  webhookUrl: 'https://n8n.projetosfm.com.br/webhook/escale-pokemon',

  /**
   * Obtém informações de IA sobre um Pokémon
   * @param pokemonName Nome do Pokémon
   * @returns Informação de IA sobre o Pokémon ou null em caso de erro
   */
  async getPokemonInfo(pokemonName: string): Promise<string | null> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pokemon: pokemonName })
      });

      if (!response.ok) {
        console.warn(`Erro ao obter informações de IA para ${pokemonName}: ${response.status}`);
        return null;
      }

      const data = await response.json();
      return data.output || null;
    } catch (error) {
      // Silenciosamente ignora erros conforme solicitado
      console.warn('Erro ao chamar o webhook de IA:', error);
      return null;
    }
  }
};

export default aiService;
