<script setup>
import { ref } from 'vue';

const messages = ref([]);
let messageId = 0;

const showMessage = (text, type = 'info') => {
  const id = messageId++;
  messages.value.push({ id, text, type });
  
  setTimeout(() => {
    removeMessage(id);
  }, 3000);
};

const removeMessage = (id) => {
  const index = messages.value.findIndex(msg => msg.id === id);
  if (index !== -1) {
    messages.value.splice(index, 1);
  }
};

defineExpose({ showMessage });
</script>

<template>
  <div id="mensajes">
    <transition-group name="message">
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="['alert', `alert-${message.type}`]"
        role="alert"
      >
        <div v-html="message.text"></div>
        <button 
          type="button" 
          class="btn-close" 
          @click="removeMessage(message.id)"
          aria-label="Close"
        >
          x
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
#mensajes {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
}

.alert {
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.alert-info {
  background-color: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
}

.alert-error {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.alert-success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin-left: 1rem;
  opacity: 0.5;
}

.btn-close:hover {
  opacity: 1;
}

.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.message-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>