<template>
  <div id="app" class="app-root">
    <header class="app-header">
      <nav class="tabs">
        <router-link to="/">Start</router-link>
        <router-link to="/erdgeschoss">Erdgeschoss</router-link>
        <router-link to="/obergeschoss">Obergeschoss</router-link>
        <router-link to="/kameras">Kameras</router-link>
        <router-link to="/links">Links</router-link>
      </nav>
      <div class="right-controls">
        <router-link
          to="/notifications"
          class="navbar-btn"
          aria-label="notifications"
        >
          <IconBell />
        </router-link>
        <router-link to="/settings" class="navbar-btn" aria-label="settings">
          <IconSettings :width="20" :height="20" />
        </router-link>
      </div>
    </header>

    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss">
.app-header {
  display: grid;
  grid-template-columns: auto 72px;
  align-items: center;
  padding: 8px 12px;
  background: $color-background;
}

.tabs > a {
  margin-right: 12px;
  color: $color-front;
  text-decoration: none;

  &:hover {
    color: $color-primary;
  }
}

.right-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .navbar-btn {
    margin-right: 10px;
    margin-top: 4px;
    padding: 6px;

    :hover {
      fill: $color-primary;
    }
  }
}
</style>
