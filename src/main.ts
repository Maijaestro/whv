import { createApp as createVueApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './router'

export function createApp() {
  const app = createVueApp(App)
  const pinia = createPinia()
  const router = createRouter({ history: createWebHistory(), routes })

  app.use(pinia)
  app.use(router)

  return { app, pinia, router }
}
