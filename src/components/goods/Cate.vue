<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- 添加分类按钮 -->
            <el-button type="primary" @click="addClassify">添加分类</el-button>

            <tree-table class="treeTable" :data="cateListData" :columns="columns" show-index :selection-type="false"
                :expand-type="false" index-text="#" border :show-row-hover="false">
                <!-- 是否有效 -->
                <template slot="isOk" slot-scope="scope">

                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: forestgreen;"></i>
                    <i class="el-icon-error" v-else style="color: red;"></i>
                </template>

                <!-- 排序 -->
                <template slot="level" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level == 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>

                <!-- 操作 -->
                <template slot="action" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"
                        @click="editCate(scope.row.cat_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"
                        @click="deleteCate(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页器 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的消息对话框 -->
        <el-dialog title="添加分类" :visible.sync="addDialog" width="30%" @close="addDialogClosed">
            <el-form :model="addClassifyForm" :rules="addClassifyrules" ref="addClassifyRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addClassifyForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <el-cascader v-model="selectedKeys" :options="parentCateList" :props="parentCateListProps"
                        @change="handleChange" clearable></el-cascader>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddCate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改分类的消息对话框 -->
        <el-dialog title="修改分类" :visible.sync="setDialog" width="30%">
            <el-form :model="setClassifyForm" :rules="setClassifyRules" ref="setClassifyRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="setClassifyForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmSetCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 商品分类数据列表
            cateListData: [],
            // 数据总数
            total: 0,
            // 商品分类列表的每一列
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name',
                    minWidth: '210px'
                },
                {
                    label: '是否有效',
                    type: 'template',
                    template: 'isOk',
                    minWidth: '200px'
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'level',
                    minWidth: '200px'
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'action',
                    minWidth: '200px'
                }
            ],
            // 添加分类的消息对话框的显示与隐藏
            addDialog: false,
            // 添加分类表单
            addClassifyForm: {
                cat_name: '',
                cat_pid: 0,
                cat_level: 0
            },
            addClassifyrules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ]
            },
            // 父级分类列表
            parentCateList: [],
            // 父级分类id数组
            selectedKeys: [],
            // 级联分类列表数据配置项
            parentCateListProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: true
            },
            // 修改分类的消息对话框的显示与隐藏
            setDialog: false,
            // 修改分类表单
            setClassifyForm: {},
            // 修改分类表单验证规则
            setClassifyRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ]
            }
        };
    },
    methods: {
        // 获取商品分类列表数据
        async getCateListData() {
            const { data: result } = await this.$axios.get('categories', { params: this.queryInfo })
            if (result.meta.status != 200) {
                return this.$message.error('获取商品分类列表数据失败！')
            }
            this.getParentCateList()
            // console.log(result);
            this.cateListData = result.data.result
            this.total = result.data.total
        },
        // 监听pageSize属性
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCateListData()
        },
        // 监听pegeNum属性
        handleCurrentChange(newNum) {
            this.queryInfo.pagenum = newNum
            this.getCateListData()
        },
        // 点击按钮添加分类对话框显示
        async addClassify() {


            this.addDialog = true
        },
        // 添加分类对话框关闭
        addDialogClosed() {
            this.$refs.addClassifyRef.resetFields()
            this.selectedKeys = []
            this.addClassifyForm.cat_pid = 0
            this.addClassifyForm.cat_level = 0
        },
        // 监听级联分类列表变化时触发
        handleChange() {
            // console.log(this.selectedKeys);
            if (this.selectedKeys.length > 0) {
                this.addClassifyForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]

                this.addClassifyForm.cat_level = this.selectedKeys.length
            } else {
                this.addClassifyForm.cat_pid = 0

                this.addClassifyForm.cat_level = 0
            }
        },
        // 获取父级分类数据列表
        async getParentCateList() {
            const { data: result } = await this.$axios.get('categories', { params: { type: 2 } })
            // console.log(result);
            if (result.meta.status != 200) {
                return this.$message.error('获取父级分类列表失败！')
            }

            this.parentCateList = result.data

            // console.log(this.parentCateList);
        },
        // 确定添加分类
        confirmAddCate() {
            // console.log(this.addClassifyForm);

            this.$refs.addClassifyRef.validate(async (valid) => {
                if (valid) {
                    const { data: result } = await this.$axios.post('categories', this.addClassifyForm)

                    // console.log(result);
                    if (result.meta.status != 201) {
                        this.addDialog = false
                        return this.$message.error('添加分类失败！')
                    }

                    this.$message.success('添加分类成功！')
                    this.getCateListData()
                    this.addDialog = false
                } else {
                    return this.$message.error('请输入分类名称！');
                }
            });

        },
        // 编辑（修改）分类
        async editCate(cateId) {
            this.setDialog = true
            const { data: result } = await this.$axios.get(`categories/${cateId}`)
            if (result.meta.status != 200) {
                return this.$message.error('获取分类名称失败！')
            }

            this.$message.success('获取分类名称成功！')
            this.setClassifyForm = result.data
        },
        // 确认修改分类
        confirmSetCate() {
            this.$refs.setClassifyRef.validate(async valid => {
                if (!valid) return this.$message.error('请输入正确的分类名称！')
                const { data: result } = await this.$axios.put(`categories/${this.setClassifyForm.cat_id}`, {
                    cat_name: this.setClassifyForm.cat_name
                })
                // console.log(result);
                if (result.meta.status != 200) {
                    return this.$message.error('修改分类失败！')
                }
                this.$message.success('修改分类成功！')
                this.getCateListData()
                this.setDialog = false
            })
        },
        // 删除商品分类
        async deleteCate(cateId) {
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(error => error)
            // console.log(confirmResult);
            if (confirmResult == 'cancel') {
                this.$message('已取消删除！')
            } else {
                const { data: result } = await this.$axios.delete(`categories/${cateId}`)
                // console.log(result);
                if (result.meta.status != 200) {
                    return this.$message.error('删除分类失败！')
                }

                this.$message.success('删除分类成功！')
                this.getCateListData()
            }
        },
    },
    mounted() {
        this.getCateListData()
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.treeTable {
    margin-top: 15px;
}

.el-cascader {
    width: 100%;
}
</style>
