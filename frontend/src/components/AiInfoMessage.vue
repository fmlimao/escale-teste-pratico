<script setup lang="ts">
import { ref, watch } from 'vue';

// Props
interface Props {
  message: string | null;
}

const props = defineProps<Props>();
const isVisible = ref(false);
const animationClass = ref('');

// Observar mudanças na mensagem
watch(() => props.message, (newMessage) => {
  if (newMessage) {
    // Exibe a mensagem com animação
    isVisible.value = true;
    animationClass.value = 'fade-in';
    
    // Configura o timer para esconder a mensagem após 10 segundos
    setTimeout(() => {
      animationClass.value = 'fade-out';
      setTimeout(() => {
        isVisible.value = false;
      }, 500); // Tempo da animação de fade-out
    }, 10000); // Tempo que a mensagem fica visível
  }
});
</script>

<template>
  <div v-if="isVisible && message" :class="['ai-info-message', animationClass]">
    <div class="ai-info-content">
      <div class="ai-info-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
      </div>
      <div class="ai-info-text">{{ message }}</div>
    </div>
  </div>
</template>

<style scoped>
.ai-info-message {
  background-color: #e0f7fa;
  border-left: 4px solid #00bcd4;
  margin: 15px 0;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ai-info-content {
  display: flex;
  align-items: flex-start;
}

.ai-info-icon {
  color: #00bcd4;
  margin-right: 10px;
  flex-shrink: 0;
}

.ai-info-text {
  color: #00838f;
  font-style: italic;
  line-height: 1.5;
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

.fade-out {
  animation: fadeOut 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-10px); }
}
</style>
