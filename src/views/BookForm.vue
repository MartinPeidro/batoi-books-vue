<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useModulesStore, useBooksStore, useUsersStore } from '../stores/counter';

const route = useRoute();
const emit = defineEmits(['message']);

const modulesStore = useModulesStore();
const booksStore = useBooksStore();
const usersStore = useUsersStore();

const { allModules: modules } = storeToRefs(modulesStore);

const formData = ref({
  id: null,
  moduleCode: '',
  publisher: '',
  price: 0,
  pages: 0,
  status: '',
  comments: ''
});

const isEditing = computed(() => !!formData.value.id);
const formTitle = computed(() => isEditing.value ? 'Editar libro' : 'Añadir libro');

const validateForm = () => {
  const errors = [];

  if (!formData.value.moduleCode) {
    errors.push("Debe seleccionar un módulo.");
  }

  if (!formData.value.publisher) {
    errors.push("Debe indicar la editorial.");
  }

  if (isNaN(formData.value.price) || formData.value.price < 0) {
    errors.push("El precio debe ser un número válido mayor o igual que 0.");
  }

  if (isNaN(formData.value.pages) || !Number.isInteger(formData.value.pages) || formData.value.pages < 0) {
    errors.push("El número de páginas debe ser un valor entero mayor o igual que 0.");
  }

  if (!formData.value.status) {
    errors.push("Debe especificar el estado del libro.");
  }

  if (errors.length > 0) {
    const errorMessage = `
      <strong>Se han detectado algunos errores en el formulario:</strong>
      <ul class="mt-2 mb-0">
        ${errors.map((err) => `<li>${err}</li>`).join("")}
      </ul>
    `;
    emit('message', { text: errorMessage, type: 'error' });
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const payload = {
      ...formData.value,
      userId: usersStore.currentUserId
    };

    if (isEditing.value) {
      await booksStore.changeBook(payload);
      emit('message', { text: 'Libro actualizado', type: 'info' });
    } else {
      if (booksStore.bookExists(payload.userId, payload.moduleCode)) {
        emit('message', { text: 'El usuario ya tiene un libro para este módulo', type: 'error' });
        return;
      }
      await booksStore.addBook(payload);
      emit('message', { text: 'Libro añadido', type: 'info' });
    }

    handleReset();
  } catch (error) {
    emit('message', { text: `Error al guardar el libro: ${error.message}`, type: 'error' });
  }
};

const handleReset = () => {
  formData.value = {
    id: null,
    moduleCode: '',
    publisher: '',
    price: 0,
    pages: 0,
    status: '',
    comments: ''
  };
};

const fillForm = (book) => {
  formData.value = {
    id: book.id,
    moduleCode: book.moduleCode,
    publisher: book.publisher,
    price: book.price,
    pages: book.pages,
    status: book.status,
    comments: book.comments
  };
};

onMounted(() => {
  if (route.params.book) {
    try {
      const book = JSON.parse(route.params.book);
      fillForm(book);
    } catch (error) {
      console.error('Error al parsear el libro:', error);
    }
  }
});

defineExpose({ fillForm });
</script>

<template>
  <div id="form">
    <form id="bookForm" @submit.prevent="handleSubmit" @reset="handleReset" novalidate>
      <label for="title">{{ formTitle }}</label>
      
      <!-- id (hidden) -->
      <div>
        <input type="text" id="id-book" v-model="formData.id" readonly />
      </div>

      <!-- moduleCode -->
      <div>
        <label for="moduleCode">Módulo:</label>
        <select id="moduleCode" v-model="formData.moduleCode" required>
          <option value="">Selecciona un módulo</option>
          <option 
            v-for="module in modules" 
            :key="module.code" 
            :value="module.code"
          >
            {{ module.vliteral }}
          </option>
        </select>
      </div>

      <!-- publisher -->
      <div>
        <label for="publisher">Editorial:</label>
        <input type="text" id="publisher" v-model="formData.publisher" required />
      </div>

      <!-- price -->
      <div>
        <label for="price">Precio (€):</label>
        <input 
          type="number" 
          id="price" 
          v-model.number="formData.price" 
          required 
          min="0" 
          step="0.01" 
        />
      </div>

      <!-- pages -->
      <div>
        <label for="pages">Páginas:</label>
        <input 
          type="number" 
          id="pages" 
          v-model.number="formData.pages" 
          required 
          min="1" 
        />
      </div>

      <!-- status -->
      <div>
        <label>Estado:</label>
        <label>
          <input type="radio" name="status" value="nuevo" v-model="formData.status" required /> 
          Nuevo
        </label>
        <label>
          <input type="radio" name="status" value="bueno" v-model="formData.status" /> 
          Bueno
        </label>
        <label>
          <input type="radio" name="status" value="malo" v-model="formData.status" /> 
          Malo
        </label>
        <label>
          <input type="radio" name="status" value="digital" v-model="formData.status" /> 
          Digital
        </label>
      </div>

      <!-- comments -->
      <div>
        <label for="comments">Comentarios:</label>
        <textarea 
          id="comments" 
          v-model="formData.comments" 
          maxlength="300"
        ></textarea>
      </div>

      <!-- Botones -->
      <div>
        <button type="submit">Guardar</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
#form {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

form > div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input[type="text"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
}

button:hover {
  background-color: #0056b3;
}

button[type="reset"] {
  background-color: #6c757d;
}

button[type="reset"]:hover {
  background-color: #5a6268;
}
</style>