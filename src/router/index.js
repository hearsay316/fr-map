import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Index",
    component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue"),
    meta: {
      title: ""
    }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import( /* webpackChunkName: "login" */"../views/login/index.vue"),
    meta: {
      title: "登陆"
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
