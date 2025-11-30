import { defineStore } from 'pinia'
import UserService from '@/services/UserService'

export const useUserStore = defineStore("users", {
  state: () => ({
    usersById: {},     // { userId: userData }
    lastFetched: {},   // { userId: timestamp }
  }),

  actions: {
    async loadUser(userId) {
      const FIVE_MIN = 5 * 60 * 1000;
      const now = Date.now();

      if (this.usersById[userId] &&
          now - this.lastFetched[userId] < FIVE_MIN) {
        return this.usersById[userId];
      }

      const user = await UserService.getUserById(userId);
      this.usersById[userId] = user;
      this.lastFetched[userId] = now;

      return user;
    }
  }
});
