import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RoomsView from '../views/RoomsView.vue'
import PageNotFound from '../views/PageNotFound.vue'
import BookView from '../views/BookView.vue'
import LoginView from '../views/LoginView.vue'
import RoomView from '../views/RoomView.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
      path: '/rooms',
      name: 'rooms',
      component: RoomsView
  },
  {
    path: '/rooms/:id',
    name: 'room',
    component: RoomView
},
{
    path: '/book',
    name: 'book',
    component: BookView
},
{
    path: '/login',
    name: 'login',
    component: LoginView
},
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  { path: "*", component: PageNotFound }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
