import { defineStore } from "pinia";
import { auth, login, logout, onUserChanged } from "@/firebase/firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: true
  }),

  actions: {
    init() {
      onUserChanged(u => {
        this.user = u;
        this.loading = false;
      });
    },

    async doLogin(email, password) {
      await login(email, password);
    },

    async doLogout() {
      await logout();
    }
  }
});
