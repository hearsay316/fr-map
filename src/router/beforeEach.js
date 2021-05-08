
import router from './index'
import { cookie } from '../utils/common'
const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  // /* 路由发生变化修改页面title */
  // if (to.meta.title) {
  //   document.title = `南京市应急指挥调度综合平台 | ${to.meta.title}`
  // }
  const isCookie =  cookie('get', 'token')
  // 判断登陆逻辑
  if (isCookie) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else if (to.path === '/huaita' && to.query.id && to.query.id === md5('423535')) {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach((to) => {
  console.log(to)
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = `消防救援现场协同指挥系统 | ${to.meta.title}`
  } else {
    document.title = '消防救援现场协同指挥系统'
  }
})
