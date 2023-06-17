<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- 头部警告提示 -->
            <el-alert title="注意！只允许为第三级分类设置相关参数！" type="warning" show-icon>
            </el-alert>

            <el-row>
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 商品分类的级联选择框 -->
                    <el-cascader v-model="selectedKeys" :options="cateList" :props="cateListProps"
                        @change="handleChange"></el-cascader>
                </el-col>
            </el-row>

            <!-- tabs切换 -->
            <el-tabs v-model="activeName" @tab-click="handleTabsClick">
                <el-tab-pane label="动态参数" name="many">
                    <!-- 动态参数按钮 -->
                    <el-button type="primary" size="mini" :disabled="isParamsBtnShow"
                        @click="addDialog = true">添加参数</el-button>
                    <!-- 动态参数表格渲染 -->
                    <el-table :data="manyDataList" border stripe>
                        <!-- 展开列 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable
                                    @close="handleClosed(index, scope.row)">{{ item
                                    }}</el-tag>

                                <!-- 添加tags -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                                    ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New
                                    Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <!-- 编辑按钮 -->
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="editParams(scope.row.attr_id)">编辑</el-button>
                                <!-- 删除按钮 -->
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <!-- 静态属性按钮 -->
                    <el-button type="primary" size="mini" :disabled="isParamsBtnShow"
                        @click="addDialog = true">添加属性</el-button>
                    <!-- 静态属性表格渲染 -->
                    <el-table :data="onlyDataList" border stripe>
                        <!-- 展开列 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable
                                    @close="handleClosed(index, scope.row)">{{ item
                                    }}</el-tag>

                                <!-- 添加tags -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                                    ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New
                                    Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="attr_name" label="属性名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <!-- 编辑按钮 -->
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="editParams(scope.row.attr_id)">编辑</el-button>
                                <!-- 删除按钮 -->
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数消息对话框 -->
        <el-dialog :title="'添加' + titleText" :visible.sync="addDialog" width="30%" @close="addDialogClosed">
            <el-form :model="addParamsForm" :rules="addParamsRules" ref="addParamsRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改参数消息对话框 -->
        <el-dialog :title="'添加' + titleText" :visible.sync="editDialog" width="30%" @close="editDialogClosed">
            <el-form :model="editParamsForm" :rules="editParamsRules" ref="editParamsRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmeditParams">确 定</el-button>
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
            // 级联选择器数据源
            cateList: [],
            // 级联选择器配置项
            cateListProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 级联选择器选中的id数组
            selectedKeys: [],
            // 选中的tabs标签名
            activeName: 'many',
            // 动态参数列表
            manyDataList: [

            ],
            // 静态参数列表
            onlyDataList: [],
            // 添加消息对话框的显示与隐藏
            addDialog: false,
            // 添加参数表单数据
            addParamsForm: {},
            // 添加参数表单验证规则
            addParamsRules: {
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                ]
            },
            // 修改参数的消息对话框的显示与隐藏
            editDialog: false,
            // 修改参数的表单数据
            editParamsForm: {},
            // 修改参数的表单验证规则
            editParamsRules: {
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                ]
            },
        };
    },
    methods: {
        // 获取商品分类数据
        async getCateList() {
            const { data: result } = await this.$axios.get('categories')
            if (result.meta.status != 200) {
                return this.$message.error('获取商品分类列表失败！')
            }
            this.cateList = result.data
            // console.log(this.cateList);
        },
        // 监听级联选择器变化，变化时触发
        handleChange() {
            // console.log(this.selectedKeys);
            this.getParamsDataList()
        },
        // 点击tabs标签触发
        handleTabsClick() {
            // console.log(this.activeName);
            this.getParamsDataList()
        },
        // 获取参数列表数据
        async getParamsDataList() {
            if (this.selectedKeys.length !== 3) {
                this.selectedKeys = []
                return
            }

            const { data: result } = await this.$axios.get(`categories/${this.paramsId}/attributes`, { params: { sel: this.activeName } })

            // console.log(result.data);
            if (result.meta.status != 200) {
                return this.$message.error('获取参数失败！')
            }

            result.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                item.inputVisible = false
                item.inputValue = ''
            });

            // console.log(result.data);

            if (this.activeName == 'many') {
                this.manyDataList = result.data
            } else if (this.activeName == 'only') {
                this.onlyDataList = result.data
            }
        },
        // 确定添加参数
        confirmAddParams() {
            this.$refs.addParamsRef.validate(async valid => {
                if (!valid) return this.$message.error('请输入正确的参数名称！')

                const { data: result } = await this.$axios.post(`categories/${this.paramsId}/attributes`, {
                    attr_name: this.addParamsForm.attr_name,
                    attr_sel: this.activeName
                })

                console.log(result);
                if (result.meta.status != 201) {
                    return this.$message.error('添加参数失败！')
                }

                this.$message.success('添加参数成功！')
                this.getParamsDataList()
                this.addDialog = false
            })
        },
        // 添加参数的对话框关闭时的回调
        addDialogClosed() {
            this.$refs.addParamsRef.resetFields();
        },
        // 修改参数的对话框关闭时的回调
        editDialogClosed() {
            this.$refs.editParamsRef.resetFields();
        },
        // 编辑（修改）参数消息对话框显示
        async editParams(attrId) {
            const { data: result } = await this.$axios.get(`categories/${this.paramsId}/attributes/${attrId}`, {
                params: { attr_sel: this.activeName }
            })
            // console.log(result);
            if (result.meta.status != 200) {
                return this.$message.error('获取参数失败!')
            }

            this.editParamsForm = result.data
            this.editDialog = true
        },
        // 确定修改参数
        confirmeditParams() {
            this.$refs.editParamsRef.validate(async valid => {
                if (!valid) {
                    return this.$message.error('请输入正确的参数名称')
                }

                const { data: result } = await this.$axios.put(`categories/${this.paramsId}/attributes/${this.editParamsForm.attr_id}`, {
                    attr_name: this.editParamsForm.attr_name,
                    attr_sel: this.activeName
                })

                if (result.meta.status != 200) {
                    return this.$message.error('修改参数失败!')
                }

                this.$message.success('修改参数成功!')
                this.getParamsDataList()
                this.editDialog = false
            })
        },
        // 删除参数
        async deleteParams(attrId) {
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(error => error)

            // console.log(confirmResult);
            if (confirmResult == 'confirm') {
                const { data: result } = await this.$axios.delete(`categories/${this.paramsId}/attributes/${attrId}`)
                if (result.meta.status != 200) {
                    return this.$message.error('删除参数失败!')
                }
                this.$message.success('删除参数成功!')
                this.getParamsDataList()
            } else {
                this.$message('已取消删除!')
            }
        },
        // input框失去焦点 按键按下enter的时候触发
        handleInputConfirm(scope) {
            // 如果input框中除去空格为空值时 return
            if (scope.inputValue.trim().length === 0) {
                scope.inputValue = ''
                scope.inputVisible = false
                return
            }
            scope.attr_vals.push(scope.inputValue.trim())
            scope.inputValue = ''
            scope.inputVisible = false
            // 反之向数据库请求保存并添加参数
            this.saveParams(scope)
        },
        // 向数据库请求参数&将保存到数据库
        async saveParams(scope) {

            const { data: result } = await this.$axios.put(`categories/${this.paramsId}/attributes/${scope.attr_id}`, {
                attr_name: scope.attr_name,
                attr_sel: scope.attr_sel,
                attr_vals: scope.attr_vals.join(' ')
            })

            if (result.meta.status != 200) {
                return this.$message.error('修改参数失败!')
            }

            this.$message.success('修改参数成功!')
        },
        // 点击按钮时input显示
        showInput(scope) {
            scope.inputVisible = true
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 删除tags标签
        handleClosed(index, scope) {
            scope.attr_vals.splice(index, 1)
            this.saveParams(scope)
        }

    },
    mounted() {
        this.getCateList()
    },
    computed: {
        // 添加参数&添加属性按钮是否显示
        isParamsBtnShow() {
            if (this.selectedKeys.length === 3) {
                return false
            } else {
                return true
            }
        },
        // 分类的id
        paramsId() {
            if (this.selectedKeys.length === 3) {
                return this.selectedKeys[2]
            } else {
                return null
            }
        },
        // 消息对话框提示
        titleText() {
            if (this.activeName == 'many') {
                return "动态参数"
            } else {
                return "静态属性"
            }
        }
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.el-row {
    margin: 15px 0;
}

.el-tag {
    margin: 10px;
}

.input-new-tag {
    width: 120px;
}
</style>
