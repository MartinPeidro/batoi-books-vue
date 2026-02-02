<script setup>
</script>

<template>
  <nav>
    <router-link to="/">Ver Libros</router-link>
    <router-link to="/add-form">Añadir Libro</router-link>
    <router-link to="/about">Acerca de...</router-link>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

nav a {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #007bff;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover {
  background-color: #e9ecef;
}

nav a.router-link-active {
  background-color: #007bff;
  color: white;
}
</style>