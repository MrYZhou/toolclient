//引入路由对象
import { createRouter, createWebHistory, createWebHashHistory, createMemoryHistory, RouteRecordRaw } from 'vue-router'
 
//vue2 mode history vue3 createWebHistory
//vue2 mode  hash  vue3  createWebHashHistory
//vue2 mode abstact vue3  createMemoryHistory
 
//路由数组的类型 RouteRecordRaw
// 定义一些路由
// 每个路由都需要映射到一个组件。
const routes: Array<RouteRecordRaw> = [{
    path: '/',
    component: () => import('../components/pannel.vue')
},{
    path:'/json-parse',
    component: ()=> import('../components/json-parse/index.vue')
},
{
    path:'/gitHelper',
    component: ()=> import('../components/gitHelper/index.vue')
},
{
    path:'/sse',
    component: ()=> import('../components/sse/index.vue')
},


]
 
 
 
const router = createRouter({
    // 这种方式可以兼容electron,在history的模式下electron不能工作。
    history: createWebHashHistory(),
    routes
})
 
//导出router
export default router