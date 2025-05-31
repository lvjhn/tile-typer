import { createMemoryHistory, createRouter, createWebHashHistory } from 'vue-router'

import MainMenuScreen from '../screens/MainMenuScreen.vue'
import AboutScreen from '../screens/AboutScreen.vue'
import StatsScreen from '../screens/StatsScreen.vue'
import InstructionsScreen from '../screens/InstructionsScreen.vue'
import GameScreen from '../screens/GameScreen.vue'

const routes = [
  { path: '/', component: MainMenuScreen },
  { path: '/about', component: AboutScreen },
  { path: '/game', component: GameScreen }, 
  { path: '/stats', component: StatsScreen }, 
  { path: '/instructions', component: InstructionsScreen }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})