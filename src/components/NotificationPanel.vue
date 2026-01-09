<template>
  <div class="notification-panel">
    <h3>Benachrichtigungen</h3>
    <ul>
      <li v-for="n in notifications" :key="n.id">
        <div class="row">
          <div class="meta">{{ n.time }} - {{ n.priority }}</div>
          <div class="title" @click="markRead(n)">{{ n.title }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useNotifications } from "../stores/notifications";

export default defineComponent({
  name: "NotificationPanel",
  setup() {
    const store = useNotifications();
    return { notifications: store.notifications, markRead: store.markRead };
  },
});
</script>
