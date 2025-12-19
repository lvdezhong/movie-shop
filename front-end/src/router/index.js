import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Favorites from '@/views/Favorites.vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import MovieDetail from '../views/MovieDetail.vue'
import ShoppingCart from '@/views/ShoppingCart.vue'
import Movies from '@/views/Movies.vue'
import Merchandise from '@/views/Merchandise.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: MovieDetail
  },
  {
    path: '/movies',
    name: 'Movies',
    component: Movies
  },
  {
    path: '/merchandise',
    name: 'Merchandise',
    component: Merchandise
  },
  {
    path: '/merchandise/:id',
    name: 'MerchandiseDetail',
    component: () => import('@/views/MerchandiseDetail.vue')
  },
  // {
  //   path: '/cart',
  //   name: 'Cart',
  //   component: Cart
  // },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/Orders.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: { requiresAuth: true }
  },
  {
    path: '/shopping-cart',
    name: 'ShoppingCart',
    component: ShoppingCart,
    meta: { requiresAuth: true }
  },
  {
    path: '/content-management',
    name: 'ContentManagement',
    component: () => import('../views/ContentManagement.vue'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 重写 push 方法
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      throw err
    }
  })
}

// 重写 replace 方法
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      throw err
    }
  })
}
router.beforeEach((to, from, next) => {
  document.title = 'cilicli';
  
  // 检查用户是否已登录
  const isAuthenticated = store.state.isLoggedIn;

  // 目标路由需要认证但用户未登录
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // 保存原始目标路径
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } 
  // 已登录用户访问登录页，重定向到首页
  else if (to.path === '/login' && isAuthenticated) {
    // 直接重定向到首页，避免循环
    next('/');
  } 
  // 其他情况直接放行
  else {
    next();
  }
});

// router.beforeEach((to, from, next) => {
//   document.title = 'cilicli';
  
//   // 检查用户是否已登录
//   const isAuthenticated = store.state.isLoggedIn;

//   // 目标路由需要认证但用户未登录
//   if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
//     // 避免无限重定向到登录页
//     if (to.path !== '/login') {
//       next({
//         path: '/login',
//         query: { redirect: to.fullPath } // 保存原始目标路径
//       });
//     } else {
//       // 已经在登录页，直接放行
//       next();
//     }
//   } 
//   // 已登录用户访问登录页，重定向到首页
//   else if (to.path === '/login' && isAuthenticated) {
//     // 使用 from.path 避免重定向到登录页
//     const redirectPath = from.path === '/login' ? '/' : from.path;
//     next(redirectPath);
//   } 
//   // 其他情况直接放行
//   else {
//     next();
//   }
// });  

// 添加全局后置钩子，处理导航错误
router.onError((error) => {
  if (error.name === 'NavigationDuplicated') {
    // 忽略重复导航错误
    return
  }
  // 其他错误正常抛出
  throw error
})

export default router 