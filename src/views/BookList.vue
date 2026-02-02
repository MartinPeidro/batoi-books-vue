<script setup>
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useBooksStore, useCartStore } from '../stores/counter';

const router = useRouter();
const emit = defineEmits(['message']);

const booksStore = useBooksStore();
const cartStore = useCartStore();

const { allBooks: books } = storeToRefs(booksStore);

const handleAddToCart = (book) => {
  try {
    cartStore.addItem(book);
    emit('message', { text: 'Libro añadido al carrito', type: 'info' });
  } catch (error) {
    emit('message', { text: `Error al añadir el libro al carrito: ${error.message}`, type: 'error' });
  }
};

const handleEdit = (book) => {
  router.push({ name: 'edit-form', params: { book: book.id } });
};

const handleDelete = async (bookId) => {
  try {
    await booksStore.removeBook(bookId);
    emit('message', { text: 'Libro eliminado', type: 'info' });
  } catch (error) {
    emit('message', { text: `Error al eliminar el libro: ${error.message}`, type: 'error' });
  }
};
</script>

<template>
  <div id="list">
    <div 
      v-for="book in books" 
      :key="book.id"
      :id="`book-${book.id}`"
      class="card"
    >
      <div>
        <h3>{{ book.moduleCode }} ({{ book.id }})</h3>
        <h4>{{ book.publisher }}</h4>
        <p>{{ book.pages }} páginas</p>
        <p>Estado: {{ book.status }}</p>
        <p>
          {{ book.forSale ? "En venta" : `Vendido ${book.soldDate ? new Date(book.soldDate).toLocaleDateString('es-ES') : "—"}` }}
        </p>
        <p>Comentarios: {{ book.comments }}</p>
        <h4>{{ book.price }} €</h4>
      </div>
      <div class="botones-card">
        <button class="btn-add-cart" @click="handleAddToCart(book)" :title="'Añadir al carrito'">
          <span class="material-icons">shopping_cart_checkout</span>
        </button>

        <button class="btn-edit" @click="handleEdit(book)" :title="'Editar libro'">
          <span class="material-icons">edit</span>
        </button>

        <button class="btn-delete" @click="handleDelete(book.id)" :title="'Eliminar libro'">
          <span class="material-icons">delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card h3 {
  margin: 0 0 0.5rem 0;
  color: #007bff;
}

.card h4 {
  margin: 0.5rem 0;
}

.card p {
  margin: 0.25rem 0;
  color: #6c757d;
}

.botones-card {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.botones-card button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
}

.botones-card button:hover {
  background-color: #0056b3;
}

.btn-delete {
  background-color: #dc3545 !important;
}

.btn-delete:hover {
  background-color: #c82333 !important;
}

.btn-edit {
  background-color: #ffc107 !important;
}

.btn-edit:hover {
  background-color: #e0a800 !important;
}
</style>