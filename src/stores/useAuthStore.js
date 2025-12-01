import { defineStore } from "pinia";
import { login, logout, onUserChanged } from "@/firebase/firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: true
  }),

  actions: {
    init() {
      onUserChanged(firebaseUser => {
        if (firebaseUser) {
          this.user = {
            id: firebaseUser.uid,
            picture: firebaseUser.picture,
            name: firebaseUser.displayName || "Indefinido",
            email: firebaseUser.email
          };
        } else {
          this.user = null;
        }

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
