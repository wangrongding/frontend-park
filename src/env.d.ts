/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

declare module '*.vue' {
  import { defineComponent } from 'vue'

  const Component: ReturnType<typeof defineComponent>
  export default Component
}
