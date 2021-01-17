import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../views/home.vue'
import Game from '../views/game.vue'

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/game',
    name: 'game',
    component: Game
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: () => {
      return { path: '/' }
    }
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes: routes
})
