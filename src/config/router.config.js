// eslint-disable-next-line
import { UserLayout, BasicLayout, PageView } from '@/layouts'
import { bxAnaalyse, bxAna, bxPlat, team } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse, roles: ['districtAdmin', 'admin', 'superAdmin'] },
        children: [
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true, roles: ['districtAdmin', 'admin', 'superAdmin'] }
          },
          {
            path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
            name: 'Analysis',
            meta: { title: '大屏监控', keepAlive: false, roles: ['districtAdmin', 'admin', 'superAdmin'] }
          }
        ]
      },
      // useradmin
      {
        path: '/useradmin',
        name: 'userAdmin',
        redirect: '/useradmin/volunteer',
        component: PageView,
        meta: { title: '用户管理', keepAlive: true, icon: team, roles: ['districtAdmin', 'admin', 'superAdmin'] },
        children: [
          {
            path: '/useradmin/volunteer/:pageNo([1-9]\\d*)?',
            name: 'VolunteerUserAdmin',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/userAdmin/volunteer'),
            meta: { title: '志愿者管理', keepAlive: true, roles: ['districtAdmin', 'admin', 'superAdmin'] }
          },
          {
            path: '/useradmin/family',
            name: 'Family',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/userAdmin/family/index'),
            meta: { title: '家属账号管理', keepAlive: true, roles: ['districtAdmin', 'admin', 'superAdmin'] }
          },
          {
            path: '/useradmin/commander',
            name: 'commander',
            hideChildrenInMenu: true,
            component: () => import('@/views/userAdmin/commander/index'),
            meta: { title: '指战员账号管理', keepAlive: true, roles: ['districtAdmin', 'admin', 'superAdmin'] }
          //  此项需要区域管理员不可见！！！！！
          }
        ]
      },
      {
        path: '/missionAdmin',
        name: 'missionAdmin',
        redirect: '/missionAdmin/missionList',
        component: PageView,
        meta: { title: '任务管理', keepAlive: true, icon: bxAna, roles: ['districtAdmin', 'admin', 'superAdmin'] },
        children: [
          {
            path: '/missionAdmin/missionList',
            name: 'MissionList',
            component: () => import('@/views/missionAdmin/missionList/index'),
            meta: { title: '任务列表', keepAlive: true, roles: ['districtAdmin', 'admin', 'superAdmin'] }
          },
          {
            path: '/missionAdmin/faceRecord',
            name: 'FaceRecord',
            component: () => import('@/views/missionAdmin/faceRecord/index'),
            meta: { title: '人脸识别记录', keepAlive: true, roles: ['districtAdmin', 'admin', 'superAdmin'] }
          }
        ]
      },
      {
        path: '/platformAdmin',
        component: PageView,
        redirect: '/platformAdmin/announcement',
        name: 'platformAdmin',
        meta: { title: '平台管理', keepAlive: true, icon: bxPlat, roles: ['districtAdmin', 'admin', 'superAdmin'] },
        children: [
          {
            path: '/platformAdmin/announcement',
            name: 'announcement',
            component: () => import('@/views/platformAdmin/announcement/index'),
            meta: { title: '公告管理', keepAlive: true, roles: ['districtAdmin', 'admin', 'superAdmin'] }
          },
          {
            path: '/platformAdmin/Banner',
            name: 'Banner',
            component: () => import('@/views/platformAdmin/Banner/index'),
            meta: { title: 'Banner管理', keepAlive: true, roles: ['districtAdmin', 'admin', 'superAdmin'] }
          },
          {
            path: '/platformAdmin/openOut',
            name: 'openOut',
            component: () => import('@/views/platformAdmin/openOut/index'),
            meta: { title: '开放平台管理', keepAlive: true, roles: ['districtAdmin', 'admin', 'superAdmin'] }
          }

        ]
      }
      // other
      /*
      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '其他组件', icon: 'slack', permission: [ 'dashboard' ] },
        redirect: '/other/icon-selector',
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/other/IconSelectorView'),
            meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/other/list',
            component: RouteView,
            meta: { title: '业务布局', icon: 'layout', permission: [ 'support' ] },
            redirect: '/other/list/tree-list',
            children: [
              {
                path: '/other/list/tree-list',
                name: 'TreeList',
                component: () => import('@/views/other/TreeList'),
                meta: { title: '树目录表格', keepAlive: true }
              },
              {
                path: '/other/list/edit-table',
                name: 'EditList',
                component: () => import('@/views/other/TableInnerEditList'),
                meta: { title: '内联编辑表格', keepAlive: true }
              },
              {
                path: '/other/list/user-list',
                name: 'UserList',
                component: () => import('@/views/other/UserList'),
                meta: { title: '用户列表', keepAlive: true }
              },
              {
                path: '/other/list/role-list',
                name: 'RoleList',
                component: () => import('@/views/other/RoleList'),
                meta: { title: '角色列表', keepAlive: true }
              },
              {
                path: '/other/list/system-role',
                name: 'SystemRole',
                component: () => import('@/views/role/RoleList'),
                meta: { title: '角色列表2', keepAlive: true }
              },
              {
                path: '/other/list/permission-list',
                name: 'PermissionList',
                component: () => import('@/views/other/PermissionList'),
                meta: { title: '权限列表', keepAlive: true }
              }
            ]
          }
        ]
      }
      */
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
