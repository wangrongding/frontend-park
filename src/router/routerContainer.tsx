import { defineComponent, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'RouterContainer',
  components: {},
  setup(props, context) {
    const route = useRoute()
    const deepestMatchedRoute = route.matched[route.matched.length - 1]
    // console.log('🚀🚀🚀 / getCurrentInstance', getCurrentInstance())
    // console.log('🚀🚀🚀 / route', route)
    // console.log('🚀🚀🚀 / route', route.matched[1].instances)
    return () => (
      <>
        <router-view />
      </>
    )
  },
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
