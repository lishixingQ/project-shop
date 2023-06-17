<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!-- 搜索框&添加用户按钮 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="findAllData">
                        <el-button slot="append" icon="el-icon-search" @click="findKeyword"></el-button>

                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addUser">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- table表格数据 -->
            <el-table :data="userListData" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名">
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                </el-table-column>
                <el-table-column prop="mobile" label="电话">
                </el-table-column>
                <el-table-column prop="role_name" label="角色">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <!-- {{ scope.row }} -->
                        <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row)">

                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="110px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                            @click="changeUser(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="deleteUser(scope.row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                                @click="setUser(scope.row)"></el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加用户消息提示框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogShow" width="30%" @close="addDialogClose">
            <!-- 主体内容区域 -->
            <el-form :model="addUserFrom" :rules="addUserFromRules" ref="addUserFromRef" label-width="70px">
                <!-- 用户名 -->
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserFrom.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserFrom.password" type="password"></el-input>
                </el-form-item>
                <!-- 邮箱 -->
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserFrom.email"></el-input>
                </el-form-item>
                <!-- 手机号 -->
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addUserFrom.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogShow = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户消息提示框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogShow" width="30%" @close="editDialogClose">
            <!-- 修改用户表单验证区域 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogShow = false">取 消</el-button>
                <el-button type="primary" @click="confirmChangeUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色消息提示框 -->
        <el-dialog title="分配角色" :visible.sync="setDialogShow" width="30%" @close="setDialogClosed">
            <p>当前的用户：{{ userInfo.username }}</p>
            <p>当前的角色：{{ userInfo.role_name }}</p>
            <p>分配新角色：
                <el-select v-model="roleNameId" placeholder="请选择">
                    <el-option v-for="item in roleNameList" :key="item.id" :label="item.roleName" :value="item.id">
                    </el-option>
                </el-select>
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setDialogShow = false">取 消</el-button>
                <el-button type="primary" @click="confirmSetRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Login from '../Login.vue';

export default {
    props: {

    },
    data() {
        // 邮箱自定义验证规则
        var checkEmail = (rule, value, callback) => {
            var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
            if (reg.test(value)) {
                return callback();
            }
            return callback(new Error('请输入正确的邮箱地址'));
        }

        // 手机号自定义验证规则
        var checkMobile = (rule, value, callback) => {
            var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
            if (reg.test(value)) {
                return callback();
            }
            return callback(new Error('请输入正确的手机号'));
        }
        return {
            // 用户列表参数
            queryInfo: {
                query: '',
                // 当前页
                pagenum: 1,
                // 每页显示数据个数
                pagesize: 2
            },
            // 用户数据列表
            userListData: [],
            total: 0,
            // 动态显示添加用户消息提示框的显示与隐藏
            addDialogShow: false,
            // 添加用户表单数据
            addUserFrom: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 添加用户表单验证规则
            addUserFromRules: {
                // 用户名验证规则
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
                ],
                // 密码验证规则
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                // 邮箱验证规则
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                // 手机号验证规则
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ],
            },
            // 修改用户消息提示框显示与隐藏
            editDialogShow: false,
            // 修改用户表单数据
            editForm: {},
            // 修改用户表单验证规则
            editFormRules: {
                email: [
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            // 分配角色消息提示框的显示与隐藏
            setDialogShow: false,
            // 点击分配角色的用户信息
            userInfo: {},
            // 角色列表
            roleNameList: [],
            // 角色列表id
            roleNameId: '',
        };
    },
    methods: {
        // 获取用户列表数据
        async getUserListData() {
            const { data: result } = await this.$axios.get('users', { params: this.queryInfo })
            // console.log(result);
            if (result.meta.status == 200) {
                this.userListData = result.data.users
                this.total = result.data.total
            } else {
                this.$message.error('获取用户数据列表失败！')
            }

        },
        // 监听当前页面数据显示个数
        handleSizeChange(newSize) {
            // console.log(newSize);
            this.queryInfo.pagesize = newSize
            this.getUserListData()
        },
        // 监听当前页面页码
        handleCurrentChange(newPage) {
            // console.log(newPage);
            this.queryInfo.pagenum = newPage
            this.getUserListData()
        },
        // 根据关键字查询数据
        findKeyword() {
            this.getUserListData()
        },
        // 搜索框清空时查找所有数据
        findAllData() {
            this.getUserListData()
        },
        // 状态切换时向后台发起请求改变后台状态数据
        async stateChange(scopeState) {
            const { data: result } = await this.$axios.put(`users/${scopeState.id}/state/${scopeState.mg_state}`)
            // console.log(scopeState);
            // console.log(result);
            if (result.meta.status == 200) {
                this.$message.success('更新状态成功！')
            } else {
                scopeState.mg_state = !scopeState.mg_state
                this.$message.error('更新状态失败！')
            }
        },
        // 点击添加用户显示消息提示框
        addUser() {
            this.addDialogShow = true
        },
        // 关闭消息提示框后清空表单
        addDialogClose() {
            this.$refs.addUserFromRef.resetFields()
        },
        editDialogClose() {
            this.$refs.editFormRef.resetFields()
        },
        // 确定添加用户
        confirmAddUser() {
            this.$refs.addUserFromRef.validate(async valid => {
                if (!valid) {
                    return
                }
                const { data: result } = await this.$axios.post('users', this.addUserFrom)
                console.log(result);
                if (result.meta.status == 201) {
                    this.$message.success('添加用户成功！')
                    this.getUserListData()
                } else {
                    this.$message.error(result.meta.msg)
                }

                // 关闭消息提示框
                this.addDialogShow = false
            })
        },
        // 点击修改用户显示消息提示框&获取用户信息
        async changeUser(id) {

            const { data: result } = await this.$axios.get(`users/${id}`);
            // console.log(result);
            if (result.meta.status == 200) {
                this.$message.success('查询用户信息成功！')
                this.editForm = result.data
                this.editDialogShow = true
            } else {
                this.$message.error('查询用户信息失败！')
            }
        },
        // 确定修改用户信息
        async confirmChangeUser() {
            const { data: result } = await this.$axios.put(`users/${this.editForm.id}`, {
                email: this.editForm.email,
                mobile: this.editForm.mobile
            })
            // console.log(result);
            if (result.meta.status == 200) {
                this.$message.success('用户信息更新成功！')
            } else {
                this.$message.error('用户信息更新失败！')
            }
            this.editDialogShow = false
            this.getUserListData()
        },
        // 删除用户信息
        async deleteUser(id) {
            const messageBoxResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(error => error)
            console.log(messageBoxResult);
            if (messageBoxResult == 'cancel') {
                this.$message('已取消删除用户！')
            }
            if (messageBoxResult == 'confirm') {
                const { data: result } = await this.$axios.delete(`users/${id}`)
                if (result.meta.status == 200) {
                    this.$message.success('已成功删除用户！')
                    this.getUserListData()
                }
            }
        },
        // 分配角色
        async setUser(userInfo) {
            this.userInfo = userInfo
            this.setDialogShow = true
            const { data: result } = await this.$axios.get('roles')
            if (result.meta.status != 200) {
                return this.$message.error('获取角色列表失败')
            }
            // console.log(result);
            this.roleNameList = result.data
        },
        // 确定分配角色
        async confirmSetRole() {
            if (!this.roleNameId) {
                return this.$message.error('请选择要分配的角色！')
            }
            const { data: result } = await this.$axios.put(`users/${this.userInfo.id}/role`, {
                rid: this.roleNameId
            })
            // console.log(result);
            if (result.meta.status != 200) {
                return this.$message.error('分配角色失败！')
            }
            this.$message.success('分配角色成功！')
            this.getUserListData()
            this.setDialogShow = false
        },
        // 分配角色消息提示框关闭
        setDialogClosed() {
            this.roleNameId = ''
            this.roleNameList = {}
        }
    },
    mounted() {
        this.getUserListData()
    },
    components: {

    },
};
</script>

<style scoped lang="less"></style>
