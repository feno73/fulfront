import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Reservations from '../views/Reservations.vue'
import Login from '../views/Login.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import ReservationsAdmin from '../components/Dashboard/Reservations.vue'
import UsersAdmin from '../components/Dashboard/Users.vue'

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
      path: '/admin',
      name: 'admin',
      component: AdminDashboard,
      children: [
          {
              path: '/reservas',
              name: 'reservas',
              component: ReservationsAdmin
          },
          {
              path: '/usuarios',
              name: 'usuarios',
              component: UsersAdmin
          }
      ]
    }
  ]
})

export default router