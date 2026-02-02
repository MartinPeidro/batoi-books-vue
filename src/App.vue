<script setup>
import { ref, onMounted } from 'vue';
import AppMenu from './components/AppMenu.vue';
import AppMessages from './components/AppMessages.vue';
import { useBooksStore, useModulesStore, useUsersStore } from './stores/counter';

const messagesRef = ref(null);

const booksStore = useBooksStore();
const modulesStore = useModulesStore();
const usersStore = useUsersStore();

const handleMessage = (message) => {
  if (messagesRef.value) {
    messagesRef.value.showMessage(message.text, message.type);
  }
};

onMounted(async () => {
  try {
    await Promise.all([
      modulesStore.populate(),
      booksStore.populate(),
      usersStore.populate()
    ]);
  } catch (error) {
    handleMessage({ 
      text: `Error de BBDD: ${error.message}`, 
      type: 'error' 
    });
  }
});
</script>

<template>
  <div id="app">
    <header>
      <img src="@/assets/logoBatoi.png" alt="Logo Batoi" />
      <h1>Batoi Books</h1>
    </header>

    <AppMenu />

    <AppMessages ref="messagesRef" />

    <main id="info">
      <router-view @message="handleMessage" />
    </main>

    <footer>Martín Peidro - DAWA</footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Arial, Helvetica, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: #007bff;
  color: white;
  padding: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

header img {
  height: 50px;
}

header h1 {
  font-size: 2rem;
}

main {
  flex: 1;
  padding: 2rem;
  background-color: #f8f9fa;
}

footer {
  background-color: #343a40;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
</style>