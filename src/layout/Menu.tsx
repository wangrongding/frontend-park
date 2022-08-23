import { defineComponent, ref } from 'vue'
import { RouteRecordRaw, useRoute } from 'vue-router'
import { ElMenu, ElSubMenu, ElMenuItem } from 'element-plus'
import { routerList } from '@/router/index'
import { getParentPaths } from '@/router/utils'
import SvgIcon from '@/components/SvgIcon/index.vue'

export default defineComponent({
  name: 'Menu',
  components: {
    ElMenu,
    ElSubMenu,
    ElMenuItem,
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const routers = routerList
    const route = useRoute()
    // 默认高亮的菜单
    const defaultActive = ref('/')
    // 父级路径
    const parentRoutes = ref<RouteRecordRaw>()
    // 获取激活的菜单
    function getDefaultActive() {
      // 当前路由的最顶级父路由
      parentRoutes.value = getParentPaths(route.path, routerList)[0]
      defaultActive.value = route.path || (parentRoutes.value?.path as string)
    }

    // 创建菜单
    function createMenuItem(item: any) {
      if (item.meta?.hidden) return null
      if (!item.meta.type || item.meta.type === 'single') {
        return (
          <el-menu-item
            key={item.key}
            index={item.path}
            disabled={item.disabled}
            selected={item.selected}
            divided={item.divided}
            v-slots={{
              title: () => item.meta.title,
            }}
          >
            {item.meta.icon && (
              <SvgIcon iconName={item.meta.icon} color={'#fff'} />
            )}
          </el-menu-item>
        )
      }
      return (
        <el-sub-menu
          index={item.path}
          hide-timeout={50}
          show-timeout={50}
          popper-offset={0}
          v-slots={{
            title: () => {
              return (
                <>
                  {item.meta.icon && (
                    <SvgIcon iconName={item.meta.icon} color={'#fff'} />
                  )}
                  <span>{item.meta.title}</span>
                </>
              )
            },
          }}
        >
          {item.children.map((child: RouteRecordRaw) => createMenuItem(child))}
        </el-sub-menu>
      )
    }

    // 监听路由变化
    watch(
      () => route,
      () => {
        getDefaultActive()
      },
      { immediate: true, deep: true },
    )

    return () => (
      <>
        <el-menu
          mode='horizontal'
          collapse={props.isCollapse}
          class='el-menu-vertical'
          collapse-transition={false}
          background-color='#516FA3'
          menu-trigger='hover'
          text-color='#fff'
          default-active={defaultActive.value}
          unique-opened={true}
          active-text-color='#ffd04b'
          router={true}
        >
          {routers.map((item: RouteRecordRaw) => createMenuItem(item))}
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
  watch: {},
})
