<template>
    <div class="main">
        <img src="../assets/jinglingBg2.08e04217.png" alt="">
        <h3>欢迎来到<span>精灵购物</span>平台管理系统</h3>
        <p>老陈前端课堂版权所有©2023
            <br>@ChenFuguo互联网技术传播者
        </p>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {

        };
    },
    methods: {

    },
    components: {

    },
};
</script>

<style scoped lang="less">
.main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    h3 {
        font-size: 46.8px;
        color: white;
        letter-spacing: 10px;

        span {
            font-size: 70px;
            color: #06F8FC;
        }
    }

    img {
        width: 500px;
        height: 250px;
    }

    p {
        font-size: 12px;
        color: #e4e1e1;
    }
}
</style>
