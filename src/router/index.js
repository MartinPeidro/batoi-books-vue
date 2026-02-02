import { createRouter, createWebHistory } from 'vue-router'
import BookView from '../views/BookView.vue'
import BookForm from '../views/BookForm.vue'
import AboutView from '../views/AboutView.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: BookView
  },
  {
    path: '/add-form',
    name: 'add-form',
    component: BookForm
  },
  {
    path: '/edit-form/:id',
    name: 'edit-form',
    component: BookForm,
    props: true
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router
