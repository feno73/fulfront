import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Reservations from '../views/Reservations.vue'
import Login from '../views/Login.vue'
import ReservationForm from '../views/ReservationForm.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: Reservations
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/reservation-form/:date/:time',
      name: 'reservation-form',
      component: ReservationForm
    }
  ]
})

export default router