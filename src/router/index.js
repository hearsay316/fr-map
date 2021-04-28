import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Index",
    component: () => import("../views/Home.vue"),
    meta: {
      title: ""
    }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/login/index.vue"),
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
