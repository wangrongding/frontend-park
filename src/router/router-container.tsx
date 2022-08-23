import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent(() => {
  const state = reactive({
    count: 123,
  })
  return () => (
    <>
      state.count: {state.count}
      <router-view />
    </>
  )
})

/* 
export default function routeReplaceSelf(component) {
  return {
    name: 'routeReplaceSelf',
    computed: {
      showChild() {
        const deepestMatchedRoute = this.$route.matched[this.$route.matched.length - 1];
        return deepestMatchedRoute.instances.default !== this;
      },
    },
    render(h) {
      const child = this.showChild ? h('router-view') : h(component);

      return h('keep-alive', [child]);
    },
  };
}
*/
/* {
  name: 'RouterContainer',
  components: {},
  setup(props, context) {
    const route = useRoute()
    const deepestMatchedRoute = route.matched[route.matched.length - 1]
    return () => (
      <>
        <router-view />
      </>
    )
  },
} */
