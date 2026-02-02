<template>
  <div class="book-view">
    <BookList @message="handleMessage" />
  </div>
</template>

<script setup>
import BookList from './BookList.vue';

const emit = defineEmits(['message']);

const handleMessage = (message) => {
  emit('message', message);
};
</script>

<style scoped>
.book-view {
  padding: 1rem;
}
</style>