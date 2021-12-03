// Fichier pivot qui fait le lien entre les views, modèles et composants.
import { createApp } from "vue";
import App from "./App.vue";
import "axios";

import router from "./router";
createApp(App)
  .use(router)
  .mount("#app");
