import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '../api/token'
import HomeRedirect from '../views/HomeRedirect.vue'
import InviteView from '../views/InviteView.vue'
import StudioEditor from '../views/StudioEditor.vue'
import StudioHistory from '../views/StudioHistory.vue'
import StudioList from '../views/StudioList.vue'
import StudioLogin from '../views/StudioLogin.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeRedirect },
    { path: '/i/:slug', component: InviteView },
    { path: '/studio/login', component: StudioLogin },
    { path: '/studio/history', component: StudioHistory, meta: { auth: true } },
    { path: '/studio', component: StudioList, meta: { auth: true } },
    { path: '/studio/:id', component: StudioEditor, meta: { auth: true } },
  ],
})

router.beforeEach(to => {
  if (to.meta.auth && !getToken()) {
    return { path: '/studio/login', query: { next: to.fullPath } }
  }

  if (to.path === '/studio/login' && getToken()) return { path: '/studio' }
})

export default router
