<script setup>
import { storeToRefs } from 'pinia';
import { useCartStore } from '../stores/counter';

const emit = defineEmits(['message']);

const cartStore = useCartStore();
const { cartItems, cartCount, cartTotal } = storeToRefs(cartStore);

const removeFromCart = (bookId) => {
  try {
    cartStore.removeItem(bookId);
    emit('message', { text: 'Libro eliminado del carrito', type: 'info' });
  } catch (error) {
    emit('message', { text: `Error: ${error.message}`, type: 'error' });
  }
};

const clearCart = () => {
  cartStore.clearCart();
  emit('message', { text: 'Carrito vaciado', type: 'info' });
};
</script>

<template>
  <div class="cart-container">
    <h2>Carrito de Compras</h2>
    
    <div v-if="cartCount === 0" class="empty-cart">
      <p>El carrito está vacío</p>
    </div>

    <div v-else>
      <div 
        v-for="book in cartItems" 
        :key="book.id"
        class="cart-item"
      >
        <div class="cart-item-info">
          <h4>{{ book.moduleCode }} - {{ book.publisher }}</h4>
          <p>{{ book.price }} €</p>
        </div>
        <button class="btn-remove" @click="removeFromCart(book.id)">
          <span class="material-icons">delete</span>
        </button>
      </div>

      <div class="cart-summary">
        <h3>Total: {{ cartTotal }} €</h3>
        <p>{{ cartCount }} libro(s)</p>
        <button class="btn-clear" @click="clearCart">Vaciar carrito</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-container {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 1rem 0;
}

.empty-cart {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.cart-item-info h4 {
  margin: 0 0 0.5rem 0;
}

.cart-item-info p {
  margin: 0;
  font-weight: bold;
  color: #28a745;
}

.btn-remove {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #dc3545;
  color: white;
}

.btn-remove:hover {
  background-color: #c82333;
}

.cart-summary {
  margin-top: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 4px;
  text-align: center;
}

.cart-summary h3 {
  color: #28a745;
  margin-bottom: 0.5rem;
}

.btn-clear {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-clear:hover {
  background-color: #5a6268;
}
</style>