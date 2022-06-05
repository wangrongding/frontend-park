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

// declare module '*.js'
// 处理导入路径不能以“.ts”扩展名结束。
declare module '*.ts'
