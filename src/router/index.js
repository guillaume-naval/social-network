//configuration des routes
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Profile.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import NotFound from "@/views/NotFound.vue";
import Profile from "@/views/Profile.vue";
import OthersProfile from "@/views/OthersProfile.vue";
import Feed from "@/views/Feed.vue";
import Post from "@/views/Post.vue";

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: "/profil",
    name: "Profile",
    component: Home,
    meta: {
      title: "Profile",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Login",
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "Register",
    },
  },
  {
    path: "/feed",
    name: "Feed",
    component: Feed,
    meta: {
      title: "Fil d'actualité",
    },
  },
  {
    name: "NotFound",
    path: "/:pathMatch(.*)",
    component: NotFound,
    meta: {
      title: "404 Not Found",
    },    
  },
  {
    path: "/profil",
    name: "Profil",
    component: Profile,
    meta: {
      title: "Profil",
    },
  },
  {
    path: "/userprofile",
    name: "userProfile",
    component: OthersProfile,
    meta: {
      title: "userProfile",
    },
  },
  {
    path: "/post",
    name: "Post",
    component: Post,
    meta: {
      title: "Post",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
