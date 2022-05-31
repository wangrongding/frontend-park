import { createPinia, defineStore } from 'pinia'

const pinia = createPinia()
export default pinia

export const useStore = defineStore('main', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => ({
    // 所有这些属性都将自动推断其类型
    counter: 0,
    name: 'Eduardo',
    isAdmin: true,
  }),
  getters: {
    // getUserInfo: (state) => state.navigatorInfo,
  },
  actions: {
    // setUserInfo(data: any) {},
    // async login() {},
  },
})
