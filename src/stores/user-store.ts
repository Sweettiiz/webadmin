import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userName: 'test test101',
      email: 'hublic.softwarehouse@gmail.com',
    }
  },

  actions: {
    changeUserName(userName: string) {
      this.userName = userName
    },
  },
})
