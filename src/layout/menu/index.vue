<template>
    <div>
        <template v-for="(item,index) in menuList" :key="item.path">

            <!-- 没子路由 -->
            <template v-if="!item.children">
                <el-menu-item :index="item.path" v-if="!item.meta.hidden" @click="goRoute">
                        <el-icon>
                            <component :is="item.meta.icon"/>
                        </el-icon>
                        <span>{{ item.meta.title }}</span>
                </el-menu-item>
            </template>
            
            <!-- 有子路由，但只有一个 -->
            <template v-if="item.children&&item.children.length==1">
                <el-menu-item :index="item.children[0].path" v-if="!item.children[0].meta.hidden" @click="goRoute">
                    <el-icon>
                        <component :is="item.children[0].meta.icon"/>
                    </el-icon>
                    <span>{{ item.children[0].meta.title }}</span>
                </el-menu-item>
            </template>

            <!-- 有子路由，且个数大于一个 -->
            <el-sub-menu v-if="item.children&&item.children.length>1" :index="item.path">
                <template #title>
                    <el-icon>
                        <component :is="item.meta.icon"/>
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
                </template>
                <Menu :menuList="item.children"></Menu>
            </el-sub-menu>
        </template>
    </div>
</template>

<script setup lang="ts">
//获取父组件传递过来的全部路由数组
defineProps(['menuList'])
import{useRouter} from 'vue-router'
let $router = useRouter()
// 点击菜单的回调
const goRoute = (vc:any) => {
    //路由跳转
    $router.push(vc.index)
    
}
</script>

<script lang="ts">
export default{name:'Menu'}
</script>

<style scoped lang="scss">

</style>