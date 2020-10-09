import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: 'school',
        name: 'School',
        component: () => import('../views/School.vue'),
      },
      {
        path: 'reviews',
        name: 'Reviews',
        component: () => import('../views/Reviews.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const success = (await axios.post('/api/verification')).data.response.success;

  if (!success && to.path !== '/login') {
    next({ path: '/login' });
  } else if (to.path === '/login' && success) {
    next({ path: '/' });
  } else {
    next();
  }
});

export default router;
