import { createApp as createVueApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './router'
import iobrokerService from './services/iobrokerService'

export function createApp() {
  const app = createVueApp(App)
  const pinia = createPinia()
  const router = createRouter({ history: createWebHistory(), routes })

  app.use(pinia)
  app.use(router)

  // Initialize iobroker WebSocket connection on app creation
/*   iobrokerService.connect().catch(e => {
    console.error('Failed to connect to ioBroker on startup:', e)
  })
 */
  return { app, pinia, router }
}
