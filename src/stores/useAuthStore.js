import { defineStore } from "pinia";
import { login, logout, onUserChanged } from "@/firebase/firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: true
  }),

  actions: {
    init() {
      onUserChanged(user => {
        this.user = user;
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