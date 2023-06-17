<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 提示区域 -->
            <el-alert title="添加商品信息" type="info" show-icon center :closable="false">
            </el-alert>

            <!-- 步骤区域 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- 添加商品表单 -->
            <el-form :model="addShopForm" :rules="addShopRules" ref="addShopRef" label-position="top">
                <!-- 标签分页区域 -->
                <el-tabs tab-position="left" v-model="activeIndex" :before-leave="tabsBeforeLeave"
                    @tab-click="tabshandleChange(activeIndex)">
                    <el-tab-pane label="基本信息" name="0">
                        <!-- 基本信息表单验证区域 -->
                        <!-- 商品名称 -->
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addShopForm.goods_name"></el-input>
                        </el-form-item>
                        <!-- 商品名称 -->
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addShopForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <!-- 商品名称 -->
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addShopForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <!-- 商品名称 -->
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addShopForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <!-- 商品分类 -->
                        <el-form-item label="商品分类" prop="goods_cat">
                            <!-- 商品分类级联选择器 -->
                            <el-cascader v-model="addShopForm.goods_cat" :options="shopClassData" :props="shopClassProps"
                                @change="handleChange" clearable></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="(item, index) in manyParamsList" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="item1" v-for="(item1, index1) in item.attr_vals" :key="index1"
                                    border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item2.attr_name" v-for="item2 in onlyParamsList" :key="item2.attr_id">
                            <el-input v-model="item2.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- 图片上传 -->
                        <el-upload :action="uploadUrl" :on-preview="handlePreview" :on-remove="handleRemove"
                            :on-success="handleSuccess" list-type="picture" :headers="headerObj">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addShopForm.goods_introduce">
                        </quill-editor>

                        <!-- 添加商品按钮 -->
                        <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>


        <!-- 图片预览对话框 -->
        <el-dialog title="图片预览" :visible.sync="previewDialog" width="50%">
            <img :src="previewUrl" alt="" style="width: 100%;">
        </el-dialog>
    </div>
</template>

<script>
import _ from "lodash";
export default {
    props: {

    },
    data() {
        return {
            // 选中的标签页索引
            activeIndex: '0',
            // 添加商品表单数据
            addShopForm: {
                goods_name: '',
                goods_price: 0,
                goods_number: 0,
                goods_weight: 0,
                // 级联选择器选中的id数组
                goods_cat: [],
                // 上传图片的临时路径
                pics: [],
                // 商品介绍
                goods_introduce: '',
                attrs: []
            },
            // 添加商品表单验证规则
            addShopRules: {
                // 商品名称验证规则
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                // 商品价格验证规则
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                // 商品名数量验证规则
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                ],
                // 商品重量验证规则
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
                goods_cat: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' },
                ]
            },
            // 商品分类列表级联选择器数据源
            shopClassData: [],
            // 级联选择器配置项
            shopClassProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 静态参数列表数据
            manyParamsList: [],
            // 动态属性列表数据
            onlyParamsList: [],
            // 上传图片的url地址
            uploadUrl: 'http://www.chenfuguo.cn:8899/api/private/v1/upload',
            // 上传图片请求头设置token
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            // 预览图片路径
            previewUrl: '',
            // 图片预览对话框的显示与隐藏
            previewDialog: false,
        }
    },
    methods: {
        // 获取商品分类级联选择器数据
        async getShopClassData() {

            const { data: result } = await this.$axios.get('categories')
            if (result.meta.status != 200) {
                return this.$message.error('获取商品分类列表失败!')
            }

            this.shopClassData = result.data
        },
        // 级联选择器触发时调用函数
        handleChange() {

            if (this.addShopForm.goods_cat.length !== 3) {
                this.addShopForm.goods_cat = []
            }

            return null
        },
        // tabs标签切换之前触发
        tabsBeforeLeave(activeName, oldActiveName) {
            // this.activeIndex = activeName
            // console.log('去哪里' + activeName, '从哪来' + oldActiveName)
            // return false
            if (oldActiveName === '0' && this.addShopForm.goods_cat.length !== 3) {
                this.$message.error('请先选择商品分类!')
                return false
            }
        },
        // 标签被选中时被触发
        async tabshandleChange(activeIndex) {
            if (activeIndex == 1) {
                const { data: result } = await this.$axios.get(`categories/${this.paramsId}/attributes`, {
                    params: { sel: 'many' }
                })

                // console.log(result);
                if (result.meta.status != 200) {
                    return this.$message.error('获取静态参数列表失败!')
                }

                result.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length !== 0 ? item.attr_vals.split(' ') : []
                })

                this.manyParamsList = result.data
            }

            if (activeIndex == 2) {
                const { data: result } = await this.$axios.get(`categories/${this.paramsId}/attributes`, {
                    params: { sel: 'only' }
                })

                // console.log(result);
                if (result.meta.status != 200) {
                    return this.$message.error('获取动态参数列表失败!')
                }

                // result.data.forEach(item => {
                //     item.attr_vals = item.attr_vals.length !== 0 ? item.attr_vals.split(' ') : []
                // })

                this.onlyParamsList = result.data
            }
        },
        // 处理图片预览的函数
        handlePreview(file) {
            console.log(file);
            this.previewUrl = file.response.data.url
            console.log(this.previewUrl);
            this.previewDialog = true

        },
        // 处理图片删除的函数
        handleRemove(file) {
            // 要删除图片的临时路径
            const filePath = file.response.data.tmp_path
            // 在pic数组中查找要删除图片的索引
            const index = this.addShopForm.pics.findIndex(item => {
                return item.pic === filePath
            })
            // 调用数组方法splice删除图片路径
            this.addShopForm.pics.splice(index, 1)
            // console.log(this.addShopForm);
        },
        // 图片上传成功的回调
        handleSuccess(response) {
            // console.log(response);
            const picInfo = { pic: response.data.tmp_path }
            this.addShopForm.pics.push(picInfo)
            // console.log(this.addShopForm.pics)
        },
        // 添加商品
        add() {
            this.$refs.addShopRef.validate(async valid => {
                if (!valid) {
                    return this.$message.error('请输入正确的表单项!')
                }

                //lodash深拷贝表单项
                const form = _.cloneDeep(this.addShopForm)
                form.goods_cat = form.goods_cat.join(',')

                // 处理静态参数
                // console.log(this.manyParamsList);
                this.manyParamsList.forEach(item => {
                    // console.log(item);
                    const paramsInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.join(' ')
                    }
                    this.addShopForm.attrs.push(paramsInfo)
                })

                // 处理动态属性
                this.onlyParamsList.forEach(item => {
                    const paramsInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals
                    }
                    this.addShopForm.attrs.push(paramsInfo)
                })
                form.attrs = this.addShopForm.attrs
                // console.log(form);

                const { data: result } = await this.$axios.post('goods', form)

                // console.log(result);
                if (result.meta.status != 201) {
                    return this.$message.error('添加商品失败!')
                }

                this.$router.push('/goods')
                this.$message.success('添加商品成功')
            })
        }
    },
    mounted() {
        this.getShopClassData()
    },
    computed: {
        paramsId() {
            if (this.addShopForm.goods_cat.length === 3) {
                return this.addShopForm.goods_cat[2]
            }
        }
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.el-checkbox {
    margin: 0 5px !important;
}

.addBtn {
    margin-top: 15px
}
</style>
