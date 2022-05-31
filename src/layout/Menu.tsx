import { defineComponent, reactive, ref, Slot, Slots } from 'vue'
import { RouteRecordRaw, useRoute } from 'vue-router'
import { ElMenu, ElSubMenu, ElMenuItem } from 'element-plus'
import { routerMenu } from '@/router/index.ts'

export default defineComponent({
  name: 'Menu',
  components: {
    ElMenu,
    ElSubMenu,
    ElMenuItem,
  },
  setup(props) {
    const routerList = routerMenu
    const route = useRoute()
    // 创建菜单
    function createMenuItem(item: any) {
      if (!item.meta.type || item.meta.type === 'single') {
        return (
          <el-menu-item
            key={item.key}
            index={item.path}
            disabled={item.disabled}
            selected={item.selected}
            divided={item.divided}
          >
            {item.meta.title}
          </el-menu-item>
        )
      }
      return (
        <el-sub-menu
          index={item.path}
          v-slots={{
            title: () => item.meta.title,
          }}
        >
          {item.children.map((child: RouteRecordRaw) => createMenuItem(child))}
        </el-sub-menu>
      )
    }
    return () => (
      <>
        <el-menu
          default-active={route.matched[0].path}
          mode='horizontal'
          background-color='#516FA3'
          text-color='#fff'
          unique-opened={true}
          active-text-color='#ffd04b'
          router={true}
        >
          {routerList.map((item: RouteRecordRaw) => createMenuItem(item))}
          <el-menu-item>
            <a href='https://www.fedtop.com' target='_blank'>
              我的博客
            </a>
          </el-menu-item>
          {/* index={route.matched[route.matched.length - 1].path} */}
          <el-menu-item>
            <a href='https://github.com/wangrongding' target='_blank'>
              GitHub
            </a>
          </el-menu-item>
        </el-menu>
      </>
    )
  },
})
