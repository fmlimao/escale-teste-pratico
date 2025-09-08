<script setup lang="ts">
import { ref } from 'vue';
import ChatbotDialog from './ChatbotDialog.vue';

const showChatbot = ref(false);

const toggleChatbot = () => {
  showChatbot.value = !showChatbot.value;
};
</script>

<template>
  <div class="chatbot-container">
    <!-- Botão flutuante para abrir o chatbot -->
    <button 
      class="chatbot-button" 
      @click="toggleChatbot" 
      :class="{ 'active': showChatbot }"
      title="Assistente Pokémon"
    >
      <div class="pokeball-icon">
        <div class="pokeball-top"></div>
        <div class="pokeball-middle"></div>
        <div class="pokeball-bottom"></div>
      </div>
      <span v-if="showChatbot" class="close-icon">×</span>
    </button>

    <!-- Diálogo do chatbot -->
    <ChatbotDialog 
      v-if="showChatbot" 
      @close="showChatbot = false" 
    />
  </div>
</template>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chatbot-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.chatbot-button:hover {
  transform: scale(1.05);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
}

.chatbot-button.active {
  background-color: #e3350d;
}

.pokeball-icon {
  width: 40px;
  height: 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pokeball-top {
  width: 40px;
  height: 20px;
  background-color: #e3350d;
  border-radius: 20px 20px 0 0;
}

.pokeball-middle {
  width: 40px;
  height: 4px;
  background-color: #222224;
  position: relative;
  z-index: 2;
}

.pokeball-middle::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: #ffffff;
  border: 3px solid #222224;
  border-radius: 50%;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

.pokeball-bottom {
  width: 40px;
  height: 20px;
  background-color: #ffffff;
  border-radius: 0 0 20px 20px;
}

.close-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  color: white;
  z-index: 10;
}

.active .pokeball-icon {
  opacity: 0;
}
</style>
