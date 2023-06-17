<template>
    <div class="loginBox">
        <div class="loginFormBox">
            <!-- 头像部分 -->
            <div class="profileBox">
                <img src="@/assets/tx.jpg" alt="">
            </div>
            <!-- 表单验证部分 -->
            <el-form class="formBox" :model="loginForm" :rules="loginFormRules" ref="loginFormRefs">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-password" v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <!-- 登录重置按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="loginFormLogin">登录</el-button>
                    <el-button type="info" @click="loginFormReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            /* 动态绑定用户名密码 */
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            loginFormRules: {
                // 用户名表单验证
                username: [
                    { required: true, message: '请输入登录用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                // 密码表单验证
                password: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        // 登录检验
        loginFormLogin() {
            this.$refs.loginFormRefs.validate(async valid => {
                if (!valid) return
                let { data: result } = await this.$axios.post('login', this.loginForm)
                // console.log(result);
                // 判断状态码200即登录成功
                if (result.meta.status == 200) {
                    this.$message({
                        message: '登录成功',
                        type: 'success',
                        duration: 1000,
                    })
                    // 提示登录成功信息后跳转到home页 (先设置token)
                    window.sessionStorage.setItem('token', result.data.token)
                    this.$router.push('/home')
                } else {
                    this.$message({
                        message: '登录失败',
                        type: 'error',
                        duration: 1000
                    })
                }
            })
        },
        // 重置方法
        loginFormReset() {
            // console.log(this);
            this.$refs.loginFormRefs.resetFields();
        }
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.loginBox {
    height: 100%;
    background: url(@/assets/bj.be0436d4.jpg)no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;

    // 登录部分
    .loginFormBox {
        width: 450px;
        height: 300px;
        background-color: white;
        position: relative;
        border-radius: 10px;

        // 头像部分
        .profileBox {
            background-color: white;
            width: 110px;
            height: 110px;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #eee;
            overflow: hidden;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #e8e8e8;
            }
        }

        // 表单验证部分
        .formBox {
            width: 100%;
            position: absolute;
            bottom: 0;
            padding: 0 20px;
            box-sizing: border-box;

            // 按钮
            .btns {
                display: flex;
                justify-content: flex-end;
            }
        }
    }
}
</style>
