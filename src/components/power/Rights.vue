<template>
    <div>
        <!-- 权限列表面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 内容区域 -->
        <el-card class="box-card">
            <el-table :data="rightsListData" style="width: 100%" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="authName" label="权限名称">
                </el-table-column>
                <el-table-column prop="path" label="路径">
                </el-table-column>
                <el-table-column label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level == '0'">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level == '1'">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            rightsListData: []
        };
    },
    methods: {
        // 请求权限列表数据
        async getRightsListData() {
            const { data: result } = await this.$axios.get('rights/list')
            // console.log(result);
            if (result.meta.status == 200) {
                this.rightsListData = result.data
            }
        }
    },
    mounted() {
        this.getRightsListData()
    },
    components: {

    },
};
</script>

<style scoped lang="less"></style>
