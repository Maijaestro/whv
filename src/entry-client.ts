import { createApp } from './main'

const { app, router, pinia } = createApp()

router.isReady().then(() => {
  app.use(pinia)
  app.mount('#app')
})
