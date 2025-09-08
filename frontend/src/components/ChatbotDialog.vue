<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { usePokemonStore } from '../stores/pokemonStore';

const emit = defineEmits(['close']);
const pokemonStore = usePokemonStore();

// Estado do chat
const messages = ref<Array<{ text: string; isUser: boolean; isTyping?: boolean }>>([]);
const newMessage = ref('');
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

// URL do webhook do chatbot
const webhookUrl = 'https://n8n.projetosfm.com.br/webhook/escale-chatbot';

// Sugestões de perguntas
const suggestions = [
  'Qual é o meu pokemon mais forte?',
  'Quais tipos de pokemon eu tenho?',
  'Qual pokemon tem a melhor defesa?',
  'Qual pokemon tem o melhor ataque?'
];

// Inicialização
onMounted(() => {
  // Adiciona mensagem de boas-vindas
  messages.value.push({
    text: 'Olá! Sou o assistente Pokémon. Como posso ajudar com sua coleção?',
    isUser: false
  });
});

// Função para enviar mensagem
const sendMessage = async () => {
  if (!newMessage.value.trim() && !isLoading.value) return;
  
  const userMessage = newMessage.value.trim();
  newMessage.value = '';
  
  // Adiciona mensagem do usuário
  messages.value.push({
    text: userMessage,
    isUser: true
  });
  
  // Adiciona indicador de digitação
  messages.value.push({
    text: '...',
    isUser: false,
    isTyping: true
  });
  
  // Rola para o final da conversa
  await scrollToBottom();
  
  isLoading.value = true;
  
  try {
    // Envia pergunta para o chatbot diretamente
    // Clona e otimiza os dados dos Pokémons removendo sprites para reduzir o tamanho do JSON
    const optimizedPokemons = pokemonStore.pokemons.map(pokemon => {
      // Desestrutura o objeto para extrair sprites e o resto dos dados
      const { sprites, ...pokemonWithoutSprites } = pokemon;
      
      // Mantém apenas a URL da imagem principal do sprite para referência, se necessário
      return {
        ...pokemonWithoutSprites,
        // Adiciona apenas a URL da imagem principal, se existir
        spriteUrl: sprites?.front_default || null
      };
    });
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userText: userMessage,
        pokemons: optimizedPokemons
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao comunicar com o chatbot: ${response.status}`);
    }
    
    const data = await response.json();
    const botResponse = data.output || 'Não consegui encontrar uma resposta para sua pergunta.';
    
    // Remove indicador de digitação
    messages.value = messages.value.filter(msg => !msg.isTyping);
    
    // Adiciona resposta do chatbot
    messages.value.push({
      text: botResponse,
      isUser: false
    });
    
    // Rola para o final da conversa
    await scrollToBottom();
  } catch (error) {
    // Remove indicador de digitação
    messages.value = messages.value.filter(msg => !msg.isTyping);
    
    // Adiciona mensagem de erro
    messages.value.push({
      text: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente mais tarde.',
      isUser: false
    });
    
    console.error('Erro ao enviar mensagem:', error);
  } finally {
    isLoading.value = false;
  }
};

// Função para usar uma sugestão
const useSuggestion = (suggestion: string) => {
  newMessage.value = suggestion;
  sendMessage();
};

// Função para rolar para o final da conversa
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Função para fechar o chatbot
const closeChatbot = () => {
  emit('close');
};
</script>

<template>
  <div class="chatbot-dialog">
    <!-- Cabeçalho -->
    <div class="chatbot-header">
      <div class="chatbot-title">
        <img src="/images/poke-ball.png" alt="Pokeball" class="chatbot-icon" />
        <h3>Assistente Pokémon</h3>
      </div>
      <button class="close-button" @click="closeChatbot">&times;</button>
    </div>
    
    <!-- Mensagens -->
    <div class="chatbot-messages" ref="messagesContainer">
      <div 
        v-for="(message, index) in messages" 
        :key="index" 
        class="message"
        :class="{ 
          'user-message': message.isUser, 
          'bot-message': !message.isUser,
          'typing': message.isTyping
        }"
      >
        <div class="message-content">
          {{ message.text }}
        </div>
      </div>
    </div>
    
    <!-- Sugestões -->
    <div class="chatbot-suggestions" v-if="messages.length <= 2 && !isLoading">
      <p class="suggestions-title">Sugestões:</p>
      <div class="suggestions-list">
        <button 
          v-for="(suggestion, index) in suggestions" 
          :key="index" 
          class="suggestion-button"
          @click="useSuggestion(suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>
    
    <!-- Formulário de entrada -->
    <div class="chatbot-input">
      <input 
        type="text" 
        v-model="newMessage" 
        placeholder="Digite sua pergunta..." 
        @keyup.enter="sendMessage"
        :disabled="isLoading"
      />
      <button 
        class="send-button" 
        @click="sendMessage"
        :disabled="!newMessage.trim() || isLoading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.chatbot-dialog {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 320px;
  height: 450px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chatbot-header {
  background-color: #e3350d;
  color: white;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chatbot-title {
  display: flex;
  align-items: center;
}

.chatbot-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.chatbot-header h3 {
  margin: 0;
  font-size: 16px;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.chatbot-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 12px;
  margin-bottom: 5px;
  word-break: break-word;
}

.user-message {
  background-color: #e3f2fd;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.bot-message {
  background-color: #f1f1f1;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.typing {
  background-color: #f1f1f1;
  align-self: flex-start;
}

.typing .message-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.chatbot-suggestions {
  padding: 10px 15px;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
}

.suggestions-title {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #666;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-button {
  background-color: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-button:hover {
  background-color: #bbdefb;
}

.chatbot-input {
  padding: 10px 15px;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
}

.chatbot-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
}

.chatbot-input input:focus {
  border-color: #e3350d;
}

.send-button {
  background-color: #e3350d;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  margin-left: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #d62f0d;
}

.send-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .chatbot-dialog {
    width: 90vw;
    right: 5vw;
    bottom: 80px;
  }
}
</style>
