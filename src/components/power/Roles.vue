<template>
    <div>
        <!-- 角色列表面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 角色列表内容区域 -->
        <el-card class="box-card">
            <!-- 添加用户按钮 -->
            <el-button type="primary" @click="addRole">添加角色</el-button>

            <!-- 角色列表数据渲染 -->
            <template>
                <el-table :data="rolesListData" style="width: 100%" border stripe>
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-row :class="['bborder', index1 === 0 ? 'tborder' : '', 'vdisflex']"
                                v-for="(item1, index1) in scope.row.children" :key="item1.id">
                                <el-col :span="5">
                                    <el-tag @close="deleteRight(scope.row, item1.id)" closable>{{ item1.authName }}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="19">
                                    <el-row :class="[index2 === 0 ? '' : 'tborder', 'vdisflex']"
                                        v-for="(item2, index2) in item1.children" :key="item2.id">
                                        <el-col :span="6">
                                            <el-tag type="success" @close="deleteRight(scope.row, item2.id)" closable>
                                                {{ item2.authName }}
                                            </el-tag>
                                            <i class="el-icon-caret-right"></i>
                                        </el-col>
                                        <el-col :span="13">
                                            <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable
                                                @close="deleteRight(scope.row, item3.id)">
                                                {{ item3.authName }}
                                            </el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- <pre>
                                {{ scope.row }}
                            </pre> -->
                        </template>
                    </el-table-column>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="roleName" label="角色名称">
                    </el-table-column>
                    <el-table-column prop="roleDesc" label="角色描述">
                    </el-table-column>
                    <el-table-column label="操作" width="300px">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                @click="changeRole(scope.row.id)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                @click="deleteRole(scope.row.id)">删除</el-button>
                            <el-button type="warning" icon="el-icon-search" size="mini"
                                @click="setRights(scope.row)">分配权限</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-card>


        <!-- 添加角色对话框 -->
        <el-dialog title="添加角色" :visible.sync="addRoleDialog" width="30%">
            <el-form ref="addRolesFormRef" :model="addRolesForm" label-width="80px">
                <el-form-item label="角色名称">
                    <el-input v-model="addRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="addRolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addRoleDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddRoles">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑角色对话框 -->
        <el-dialog title="修改角色" :visible.sync="changeRoleDialog" width="30%">
            <el-form ref="changeRolesFormRef" :model="changeRolesForm" label-width="80px">
                <el-form-item label="角色名称">
                    <el-input v-model="changeRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="changeRolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changeRoleDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmChangeRoles">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightsDialog" width="50%" @close="setRightsDialogClosed">
            <el-tree :data="allRightsTree" :props="allRightsTreeProps" show-checkbox default-expand-all node-key="id"
                :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightsDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmSetRights">确 定</el-button>
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
            // 角色列表数据
            rolesListData: [],
            // 添加角色对话框的显示与隐藏
            addRoleDialog: false,
            // 添加角色表单数据
            addRolesForm: {
                // 角色名称
                roleName: '',
                // 角色描述
                roleDesc: ''
            },
            // 修改用户对话框显示与隐藏
            changeRoleDialog: false,
            // 修改用户表单数据
            changeRolesForm: {},
            // 分配权限对话框的显示与隐藏
            setRightsDialog: false,
            // 所有权限树形列表
            allRightsTree: [],
            // 树形控件分配
            allRightsTreeProps: {
                label: 'authName',
                children: 'children'
            },
            // 默认勾选权限显示的数组
            defKeys: [],
            // 树形控件中权限的id
            roleId: ''
        };
    },
    methods: {
        // 请求角色列表数据
        async getRolesListData() {
            const { data: result } = await this.$axios.get('roles')
            // console.log(result);
            if (result.meta.status == 200) {
                this.rolesListData = result.data
                // console.log(this.rolesListData);
            } else {
                this.$message.error('获取角色列表失败！')
            }
        },
        // 添加角色对话框显示
        addRole() {
            this.addRoleDialog = true
        },
        // 确定添加角色向后台添加角色数据
        async confirmAddRoles() {
            const { data: result } = await this.$axios.post('roles', this.addRolesForm)
            // console.log(result);
            if (result.meta.status == 201) {
                this.$message.success('添加角色成功!')
            } else {
                this.$message.error('添加角色失败!')
            }
            this.getRolesListData()
            this.addRoleDialog = false
        },
        // 通过id获取角色信息
        async changeRole(id) {
            // console.log(id);
            const { data: result } = await this.$axios.get(`roles/${id}`)
            // console.log(result);
            if (result.meta.status == 200) {
                this.$message.success('获取角色成功!')
                this.changeRolesForm = result.data
                this.changeRoleDialog = true
            } else {
                this.$message.error('获取角色失败!')
            }
        },
        // 确认提交修改角色
        async confirmChangeRoles() {
            // console.log(this.changeRolesForm);
            const { data: result } = await this.$axios.put(`roles/${this.changeRolesForm.roleId}`, {
                roleName: this.changeRolesForm.roleName,
                roleDesc: this.changeRolesForm.roleDesc
            })
            if (result.meta.status == 200) {
                this.$message.success('修改用户信息成功!')
                this.getRolesListData()
            } else {
                this.$message.error('修改用户信息失败!')
            }

            this.changeRoleDialog = false
        },
        // 删除角色
        async deleteRole(id) {
            const deleteRoleResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // console.log(deleteRoleResult);
            //  点取消 返回cancel
            //  点确认 返回confirm
            if (deleteRoleResult == 'confirm') {
                const { data: result } = await this.$axios.delete(`roles/${id}`)
                // console.log(result);
                if (result.meta.status == 200) {
                    this.$message.success('删除用户成功!')
                    this.getRolesListData()
                } else {
                    this.$message.error('删除用户失败!')
                }
            }
            if (deleteRoleResult == 'cancel') {
                this.$message('已取消删除角色!');
            }
        },
        // 删除权限
        async deleteRight(role, rightId) {
            const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            if (confirmResult != 'confirm') {
                return this.$message('已取消删除权限!')
            }

            const { data: result } = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)

            if (result.meta.status != 200) {
                return this.$message.error('删除权限失败!')
            }
            this.$message.success('删除权限成功!')
            role.children = result.data
        },
        // 分配权限对话框显示
        async setRights(role) {
            this.roleId = role.id
            console.log(role);
            const { data: result } = await this.$axios.get('rights/tree')
            if (result.meta.status != 200) {
                return this.$message.error('获取权限列表失败！')
            }
            this.$message.success('获取权限列表成功！')
            this.allRightsTree = result.data
            // console.log(role);
            this.getThirdListId(role, this.defKeys)
            this.setRightsDialog = true
        },
        // 通过递归获取三级列表下的id，并保存到defKeys数组中
        getThirdListId(node, arr) {

            if (!node.children) {
                //如果node节点中的查不到children 将节点的id存到arr数组中
                return arr.push(node.id)
            }
            // console.log(node.children);
            node.children.forEach(item =>
                this.getThirdListId(item, arr))
        },
        // 关闭分配权限的对话框时
        setRightsDialogClosed() {
            this.defKeys = []
        },
        // 确定修改权限
        async confirmSetRights() {
            const Keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]

            // console.log(Keys);
            const idStr = Keys.join(',')
            const { data: result } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids: idStr })
            // console.log(result);
            if (result.meta.status != 200) {
                return this.$message.error('更新权限失败！')
            }

            this.$message.success('更新权限成功！')
            this.getRolesListData()
            this.setRightsDialog = false
        }
    },
    mounted() {
        this.getRolesListData()
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.el-tag {
    margin: 7px;
}

.bborder {
    border-bottom: 1px solid #eee;
    margin: 0 50px;
}

.tborder {
    border-top: 1px solid #eee;
}

.vdisflex {
    display: flex;
    align-items: center;
}
</style>
