/// <reference types="vite/client" />

// declare module "*.vue" {
//   import type { DefineComponent } from "vue";
//   // // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
//   const component: DefineComponent<{}, {}, any>;
//   export default component;
// }

declare module '*.vue' {
  import { defineComponent } from 'vue'

  const Component: ReturnType<typeof defineComponent>
  export default Component
}

declare module '*.js'
declare module '*.ts'
declare module 'fabric'
declare module '@multiavatar/multiavatar/esm'
