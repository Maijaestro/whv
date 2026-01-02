import StartView from '../views/StartView.vue'
import FloorView from '../views/FloorView.vue'
import CamerasView from '../views/CamerasView.vue'
import LinksView from '../views/LinksView.vue'
import SettingsView from '../views/SettingsView.vue'
import NotificationsView from '../views/NotificationsView.vue'

const routes = [
  { path: '/', name: 'Start', component: StartView },
  { path: '/erdgeschoss', name: 'Erdgeschoss', component: FloorView },
  { path: '/obergeschoss', name: 'Obergeschoss', component: FloorView },
  { path: '/kameras', name: 'Kameras', component: CamerasView },
  { path: '/links', name: 'Links', component: LinksView },
  { path: '/notifications', name: 'Notifications', component: NotificationsView },
  { path: '/settings', name: 'Settings', component: SettingsView }
]

export default routes
