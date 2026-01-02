import { createApp } from './main'

export async function render(url: string, manifest: any) {
  const { app, router, pinia } = createApp()
  await router.push(url)
  await router.isReady()

  const html = '' // placeholder: server renderer integration point
  return { html }
}
