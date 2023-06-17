<template>
    <el-container class="home-container">
        <el-header>
            <div class="logo">
                <img src="../assets/jingling_logo.png" alt="">
                <span>精灵购物平台管理系统</span>
            </div>
            <el-button type="info" @click="exitLogin">退出登录</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <!-- 菜单区域 -->
                <el-menu background-color="#303641" text-color="#fff" active-text-color="#ffd04b" unique-opened
                    :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
                    <div class="toggle-button" @click="changeCollapse">|||</div>
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for=" item  in  menuDataList " :key="item.id">
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="menuIcon[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="menuItem.path" v-for=" menuItem  in  item.children " :key="menuItem.id"
                            @click="saveNavStage(menuItem.path)">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>{{ menuItem.authName }}</span>
                        </el-menu-item>
                    </el-submenu>

                </el-menu>
            </el-aside>
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            menuDataList: [],
            menuIcon: {
                '125': 'iconfont icon-users',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin-gouwudai',
                '102': 'iconfont icon-dingdan',
                '145': 'iconfont icon-shuju'
            },
            // 判断左侧菜单是否折叠
            isCollapse: false,
            // 导航链接状态
            activePath: ''
        };
    },
    methods: {
        // 退出登录
        exitLogin() {
            window.sessionStorage.removeItem('token')
            this.$router.push('/login')
            window.sessionStorage.removeItem('acivePath')
        },
        // 获取左侧菜单数据
        async getMenuData() {
            const { data: result } = await this.$axios.get('menus')
            // console.log(result.data);
            if (result.meta.status != 200) {
                this.$message.error(result.meta.message)
            } else {
                this.menuDataList = result.data
            }
        },
        // 左侧菜单是否折叠
        changeCollapse() {
            this.isCollapse = !this.isCollapse
        },
        // 保存导航链接状态
        saveNavStage(activePath) {
            window.sessionStorage.setItem('acivePath', activePath)
            this.activePath = activePath;
        }
    },
    mounted() {
        this.getMenuData()
        // this.saveNavStage()
        this.activePath = window.sessionStorage.getItem('acivePath')
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.home-container {
    height: 100%;
}

.el-header {
    background-color: #353C3E;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo {
        display: flex;
        align-items: center;
        font-size: 20px;
        color: white;

        img {
            width: 50px;
            height: 50px;
        }
    }
}

.el-aside {
    background-color: #303641;

    .el-menu {
        border-right: none;

        .toggle-button {
            width: 100%;
            background-color: #475061;
            color: white;
            font-size: 10px;
            text-align: center;
            line-height: 24px;
            letter-spacing: .2em;
            cursor: pointer;
        }

        .iconfont {
            margin-right: 10px;
        }
    }
}

.el-main {
    background: url(../assets/bj.be0436d4.jpg);
}
</style>
