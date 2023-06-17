<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
// 引入lodash
import _ from 'lodash'
export default {
    props: {

    },
    data() {
        return {
            // 需要合并的数据项
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        };
    },
    async mounted() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        const { data: result } = await this.$axios.get('reports/type/1')
        // console.log(result.data);

        // echarts4.0版本已经将normal删除
        // 此操作删除数据项areaStyle下的normal
        result.data.series.forEach(item => {
            delete item.areaStyle.normal
        })

        if (result.meta.status != 200) {
            return this.$message.error('获取数据报表失败!')
        }
        // 指定图表的配置项和数据
        const newOptions = _.merge(result.data, this.options)

        myChart.setOption(newOptions);
    },
    methods: {

    },
    components: {

    },
};
</script>

<style scoped lang="less"></style>
