import { defineStore } from 'pinia';
import Book, { User, Module } from '../model/book.class.js';
import * as Api from '../services/api.js';

const NOTE_TYPE = 'Apunts';

// Store de Books
export const useBooksStore = defineStore('books', {
  state: () => ({
    books: []
  }),

  getters: {
    allBooks: (state) => state.books,
    
    getBookById: (state) => (bookId) => {
      return state.books.find(book => book.id === bookId);
    },

    booksFromUser: (state) => (userId) => {
      return state.books.filter(book => book.userId === userId);
    },

    booksFromModule: (state) => (moduleCode) => {
      return state.books.filter(book => book.moduleCode === moduleCode);
    },

    booksCheeperThan: (state) => (price) => {
      return state.books.filter(book => book.price <= price);
    },

    booksWithStatus: (state) => (status) => {
      return state.books.filter(book => book.status === status);
    },

    booksOfTypeNotes: (state) => {
      return state.books.filter(book => book.publisher === NOTE_TYPE);
    },

    booksNotSold: (state) => {
      return state.books.filter(book => book.soldDate === '');
    },

    averagePriceOfBooks: (state) => {
      if (state.books.length === 0) return "0.00 €";
      const average = (state.books.reduce((sum, book) => sum + book.price, 0) / state.books.length).toFixed(2);
      return `${average} €`;
    },

    bookExists: (state) => (userId, moduleCode) => {
      return state.books.some(book => book.userId === userId && book.moduleCode === moduleCode);
    }
  },

  actions: {
    async populate() {
      try {
        const booksData = (await Api.getDBBooks()).data;
        if (booksData && booksData.length) {
          this.books = booksData.map(bookData => new Book(bookData));
        }
        return this.books;
      } catch (error) {
        console.error('Error al cargar libros:', error);
        throw error;
      }
    },

    async addBook(bookData) {
      try {
        const response = await Api.addDBBook(bookData);
        const savedBookData = response.data;
        if (!savedBookData) {
          throw new Error('No se pudo guardar el libro en el servidor.');
        }
        const newBook = new Book(savedBookData);
        this.books.push(newBook);
        return newBook;
      } catch (error) {
        console.error('Error al añadir libro:', error);
        throw error;
      }
    },

    async removeBook(bookId) {
      try {
        const removedBookData = (await Api.removeDBBook(bookId)).data;
        if (!removedBookData) {
          throw new Error('No se pudo eliminar el libro en el servidor o no existe');
        }
        const index = this.books.findIndex(book => book.id === bookId);
        if (index !== -1) {
          const removedBook = this.books.splice(index, 1)[0];
          return removedBook;
        } else {
          throw new Error('Libro no encontrado');
        }
      } catch (error) {
        console.error('Error al eliminar libro:', error);
        throw error;
      }
    },

    async changeBook(bookData) {
      try {
        const updatedBookData = (await Api.changeDBBook(bookData)).data;
        if (!updatedBookData) {
          throw new Error('No se pudo actualizar el libro en el servidor.');
        }
        const index = this.books.findIndex(book => book.id === updatedBookData.id);
        if (index !== -1) {
          this.books[index] = new Book(updatedBookData);
          return this.books[index];
        } else {
          throw new Error('Libro no encontrado');
        }
      } catch (error) {
        console.error('Error al actualizar libro:', error);
        throw error;
      }
    }
  }
});

// Store de Modules
export const useModulesStore = defineStore('modules', {
  state: () => ({
    modules: []
  }),

  getters: {
    allModules: (state) => state.modules,
    
    getModuleByCode: (state) => (moduleCode) => {
      const module = state.modules.find(module => module.code === moduleCode);
      if (!module) throw new Error('Módulo no encontrado');
      return module;
    }
  },

  actions: {
    async populate() {
      try {
        const moduleData = (await Api.getDBModules()).data;
        if (moduleData && moduleData.length) {
          this.modules = moduleData.map(data => new Module(data.code, data.cliteral, data.vliteral, data.courseId));
        }
        return this.modules;
      } catch (error) {
        console.error('Error al cargar módulos:', error);
        throw error;
      }
    }
  }
});

// Store de Users
export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    currentUserId: 2
  }),

  getters: {
    allUsers: (state) => state.users,
    
    currentUser: (state) => {
      return state.users.find(user => user.id === state.currentUserId);
    },

    getUserById: (state) => (userId) => {
      return state.users.find(user => user.id === userId);
    },

    getUserByNickName: (state) => (nick) => {
      return state.users.find(user => user.nick === nick);
    }
  },

  actions: {
async populate() {
  try {
    const response = await Api.getDBUsers();
    const userData = response.data;

    if (userData && userData.length) {
      this.users = userData.map(user => 
        new User(user.id, user.nick, user.email, user.password)
      );
    }
        return this.users;
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        throw error;
      }
    },

    async addUser(userData) {
      try {
        const savedUserData = await Api.addDBUser(userData);
        if (!savedUserData) {
          throw new Error('No se pudo añadir el usuario en el servidor.');
        }
        const newUser = new User(savedUserData.id, savedUserData.nick, savedUserData.email, savedUserData.password);
        this.users.push(newUser);
        return newUser;
      } catch (error) {
        console.error('Error al añadir usuario:', error);
        throw error;
      }
    },

    async removeUser(userId) {
      try {
        const removedUserData = await Api.removeDBUser(userId);
        if (!removedUserData) {
          throw new Error('No se pudo eliminar el usuario en el servidor o no existe');
        }
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1) {
          return this.users.splice(index, 1)[0];
        } else {
          throw new Error('Usuario no encontrado');
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw error;
      }
    },

    async changeUser(userData) {
      try {
        const updatedUserData = await Api.changeDBUser(userData);
        if (!updatedUserData) {
          throw new Error('No se pudo actualizar el usuario en el servidor.');
        }
        const index = this.users.findIndex(user => user.id === updatedUserData.id);
        if (index !== -1) {
          this.users[index] = new User(updatedUserData.id, updatedUserData.nick, updatedUserData.email, updatedUserData.password);
          return this.users[index];
        } else {
          throw new Error('Usuario no encontrado');
        }
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
      }
    },

    async changeUserPassword(userId, newPassword) {
      try {
        const updatedUserData = await Api.changeDBUserPassword(userId, newPassword);
        if (!updatedUserData) {
          throw new Error('No se pudo actualizar la contraseña en el servidor.');
        }
        const index = this.users.findIndex(user => user.id === updatedUserData.id);
        if (index !== -1) {
          this.users[index].password = updatedUserData.password;
          return this.users[index];
        } else {
          throw new Error('Usuario no encontrado');
        }
      } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        throw error;
      }
    },

    setCurrentUser(userId) {
      this.currentUserId = userId;
    }
  }
});

// Store de Cart
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),

  getters: {
    cartItems: (state) => state.items,
    
    cartCount: (state) => state.items.length,
    
    cartTotal: (state) => {
      return state.items.reduce((total, book) => total + book.price, 0).toFixed(2);
    },

    getBookById: (state) => (id) => {
      return state.items.find(item => item.id === id);
    },

    hasBook: (state) => (id) => {
      return state.items.some(item => item.id === id);
    }
  },

  actions: {
    addItem(book) {
      if (!(book instanceof Book)) {
        throw new Error("Solo se pueden añadir objetos de tipo Book");
      }

      if (this.hasBook(book.id)) {
        throw new Error(`El libro con id ${book.id} ya está en el carrito.`);
      }

      const bookCopy = new Book({ ...book });
      this.items.push(bookCopy);
    },

    removeItem(id) {
      const index = this.items.findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error(`No existe el libro con id ${id} en el carrito.`);
      }
      this.items.splice(index, 1);
    },

    clearCart() {
      this.items = [];
    }
  }
});