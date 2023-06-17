<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 搜索框&添加用户按钮 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="findAllData">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderListData"></el-button>

                    </el-input>
                </el-col>
            </el-row>


            <!-- 数据列表 -->
            <el-table :data="orderListData" style="width: 100%" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="order_number" label="订单编号">
                </el-table-column>
                <el-table-column prop="order_price" label="订单价格" width="75px">
                </el-table-column>
                <el-table-column label="是否付款" width="80px">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.order_pay === 1">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货" width="70px">
                </el-table-column>
                <el-table-column label="下单时间">
                    <template slot-scope="scope">
                        {{ scope.row.create_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <!-- 修改地址按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="setAddress"></el-button>
                        <!-- 查看物流信息按钮 -->
                        <el-button type="success" icon="el-icon-location-outline" size="mini"
                            @click="lookLogistics"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页器 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 修改地址对话框 -->
        <el-dialog title="修改地址" :visible.sync="setAddressDialog" width="50%">
            <!-- 修改地址的表单 -->
            <el-form :model="setAddressForm" :rules="setAddressRules" ref="setAddressRef" label-width="100px">
                <el-form-item label="省市区/县" prop="area">
                    <!-- 级联选择器 -->
                    <el-cascader :options="cityOptions" :value="city" :props="{ expandTrigger: 'hover' }"></el-cascader>
                </el-form-item>
                <el-form-item label="详情地址" prop="address">
                    <el-input v-model="setAddressForm.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setAddressDialog = false">取 消</el-button>
                <el-button type="primary" @click="setAddressDialog = false">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 查看物流信息对话框 -->
        <el-dialog title="物流进度" :visible.sync="logisticsDialog" width="50%">
            <!-- 时间线 -->
            <el-timeline>
                <el-timeline-item v-for="(item, index) in activities" :key="index" :timestamp="item.time">
                    {{ item.context }}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
import cityOptions from '@/assets/js/city_data2017_element.js'
export default {
    props: {

    },
    data() {
        return {
            // 请求参数
            queryInfo: {
                query: '',
                // 当前页码
                pagenum: 1,
                // 每页显示数据数
                pagesize: 10,
            },
            // 数据总数
            total: 0,
            // 订单列表数据
            orderListData: [],
            // 修改地址的对话框的显示与隐藏
            setAddressDialog: false,
            // 修改地址表单
            setAddressForm: {
                area: '',
                address: ''
            },
            // 修改地址表单验证规则
            setAddressRules: {
                area: [
                    { required: true, message: '请输入省市区/县', trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '请输入详情地址', trigger: 'blur' }
                ]
            },
            // 中国地区数据
            cityOptions: cityOptions,
            // 选中的地区的id数组
            city: [],
            // 物流对话框的显示与隐藏
            logisticsDialog: false,
            // 物流数据
            activities: [
                {
                    "time": "2018-05-10 09:39:00",
                    "ftime": "2018-05-10 09:39:00",
                    "context": "已签收,感谢使用顺丰,期待再次为您服务",
                    "location": ""
                },
                {
                    "time": "2018-05-10 08:23:00",
                    "ftime": "2018-05-10 08:23:00",
                    "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                    "location": ""
                },
                {
                    "time": "2018-05-10 07:32:00",
                    "ftime": "2018-05-10 07:32:00",
                    "context": "快件到达 [北京海淀育新小区营业点]",
                    "location": ""
                },
                {
                    "time": "2018-05-10 02:03:00",
                    "ftime": "2018-05-10 02:03:00",
                    "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 23:05:00",
                    "ftime": "2018-05-09 23:05:00",
                    "context": "快件到达 [北京顺义集散中心]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 21:21:00",
                    "ftime": "2018-05-09 21:21:00",
                    "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 13:07:00",
                    "ftime": "2018-05-09 13:07:00",
                    "context": "顺丰速运 已收取快件",
                    "location": ""
                },
                {
                    "time": "2018-05-09 12:25:03",
                    "ftime": "2018-05-09 12:25:03",
                    "context": "卖家发货",
                    "location": ""
                },
                {
                    "time": "2018-05-09 12:22:24",
                    "ftime": "2018-05-09 12:22:24",
                    "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                    "location": ""
                },
                {
                    "time": "2018-05-08 21:36:04",
                    "ftime": "2018-05-08 21:36:04",
                    "context": "商品已经下单",
                    "location": ""
                }
            ]
        }
    },
    methods: {
        // input清空时的回调函数
        findAllData() {
            this.getOrderListData()
        },
        // 请求订单列表数据
        async getOrderListData() {
            const { data: result } = await this.$axios.get('orders', { params: this.queryInfo })
            if (result.meta.status != 200) {
                return this.$message.error('获取订单列表失败!')
            }

            // console.log(result);
            this.orderListData = result.data.goods
            this.total = result.data.total
        },
        // 监听每页有多少条数据
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getOrderListData()
        },
        // 监听当前页码
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getOrderListData()
        },
        // 点击按钮显示修改地址的对话框
        setAddress() {
            this.setAddressDialog = true
        },
        // 点击显示物流信息对话框
        async lookLogistics() {
            this.logisticsDialog = true
            const { data: result } = await this.$axios.get('/kuaidi/1106975712662')

            console.log(result);
        },
    },
    mounted() {
        this.getOrderListData()
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.el-cascader {
    width: 100%;
}
</style>
