import StartView from '../views/StartView.vue'
import GroundFloor from '../views/GroundFloor.vue'
import UpperFloor from '../views/UpperFloor.vue'
import CamerasView from '../views/CamerasView.vue'
import LinksView from '../views/LinksView.vue'
import SettingsView from '../views/SettingsView.vue'
import NotificationsView from '../views/NotificationsView.vue'

const routes = [
  { path: '/', name: 'Start', component: StartView },
  { path: '/erdgeschoss', name: 'Erdgeschoss', component: GroundFloor },
  { path: '/obergeschoss', name: 'Obergeschoss', component: UpperFloor },
  { path: '/kameras', name: 'Kameras', component: CamerasView },
  { path: '/links', name: 'Links', component: LinksView },
  { path: '/notifications', name: 'Notifications', component: NotificationsView },
  { path: '/settings', name: 'Settings', component: SettingsView }
]

export default routes
