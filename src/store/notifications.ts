import { defineStore } from 'pinia'

export type Notification = {
  id: string
  time: string
  priority: 'Alarm' | 'Warnung' | 'Hinweis'
  title: string
  message: string
  read: boolean
  archived: boolean
  deepLink?: string
}

export const useNotifications = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[]
  }),
  actions: {
    add(n: Notification) {
      this.notifications.unshift(n)
    },
    markRead(n: Notification) {
      n.read = true
    },
    archive(n: Notification) {
      n.archived = true
    }
  }
})
