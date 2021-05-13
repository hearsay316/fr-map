<template>
    <div v-loading="loading" class="login-container">
        <h1 class="title">消防救援现场协同指挥系统</h1>
        <el-row :gutter="40">
            <el-col :offset="6" :span="12">
                <el-form
                    ref="loginForm"
                    :model="loginForm"
                    :rules="loginRules"
                    class="login-form"
                    label-position="left"
                >
                    <el-form-item prop="userCode">
                        <!-- 修改自动填充 -->
                        <el-input type="text" style="position: fixed; bottom: -9999px" />
                        <el-input
                            v-model="loginForm.userCode"
                            name="userCode"
                            type="text"
                            autocomplete="on"
                            placeholder="请输入账号"
                            clearable
                        >
                            <template #prepend>账号</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="userPassword">
                        <el-input
                            v-model="loginForm.userPassword"
                            :type="pwdType"
                            name="userPassword"
                            autocomplete="on"
                            placeholder="请输入密码"
                            clearable
                        >
                            <template #prepend>密码</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="index-login">
                        <el-button
                            :loading="loading"
                            type="primary"
                            style="width: 254px"
                            @click="handleLogin"
                        >
                            登 录
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { cookie } from '@/utils/common';
import { mapState } from 'vuex';
import { login } from '../../api/login';
import user from '../../store/modules/user';

export default {
    name: 'Login',
    data() {
        const validateUsername = (rule, value, callback) => {
            if (value.trim().length === 0) {
                callback(new Error('请输入账号'));
            } else if (value.match(/[\u4e00-\u9fa5]/gi)) {
                callback(new Error('请输入正确的账号'));
            } else {
                callback();
            }
        };
        const validatePass = (rule, value, callback) => {
            if (value.trim().length === 0) {
                callback(new Error('请输入密码'));
            } else if (value.trim().length < 6) {
                callback(new Error('密码不能小于6位'));
            } else {
                callback();
            }
        };
        return {
            // 登录表单
            loginForm: {
                userCode: '',
                userPassword: ''
            },
            // 登陆表单验证
            loginRules: {
                userCode: [{ required: true, trigger: 'blur', validator: validateUsername }],
                userPassword: [{ required: true, trigger: 'blur', validator: validatePass }]
            },
            loading: false,
            pwdType: 'password',
            redirect: undefined,
            nodeConfig: {
                // https://www.huaitaos.com/stage/system/system3.html#/login
                staging: 'http://47.103.125.18/stage/system/system1.html#/login',
                development: 'http://localhost:9528/system1.html#/login'
            }
        };
    },
    created() {
        this.initRouter();
    },
    methods: {
        // 登录
        async handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // this.loading = true;
                    /**
           * deptId: 1
           deptName: "江北新区应急管理局"
           deptShowCode: "320119"
           dsLastLoginTime: "2021-04-29 14:03:12"
           dsLoginNum: 208
           extendFirst: null
           extendSecond: null
           extendThird: null
           idCardNum: null
           officePhone: null
           ogsLastLoginTime: "2020-09-07 15:23:39.0"
           ogsLoginNum: 28
           pDeptId: 0
           pdeptId: 0
           remark: null
           roleId: 1
           roleName: "超级管理"
           takeDate: null
           token: "a8a5bf27b09f6018e2029764207c6b62b99612d1283bbce8d97a8705e6d1abffe27b3de04573a723388473198d95b877913be75d18deb03ff8f214a36ed8cb52"
           updateTime: null
           updateUser: null
           userAreaId: "138"
           userCode: "admin"
           userFox: null
           userId: 1
           userKey: "a8a5bf27b09f6018e2029764207c6b62b99612d1283bbce8d97a8705e6d1abffe27b3de04573a723388473198d95b877913be75d18deb03ff8f214a36ed8cb52"
           userName: "管理员"
           userPhone: null
           userSex: null
           userState: "normal"
           */
                    login(this.loginForm.userCode, this.loginForm.userPassword)
                        .then((res) => {
                            this.$store.commit('user/setUser', res);
                            localStorage.userData = JSON.stringify(res);
                            cookie('set', 'usercode', res.userCode, 1);
                            cookie('set', 'username', res.userName, 1);
                            cookie('set', 'deptname', res.deptName, 1);
                            cookie('set', 'token', res.token, 0.5);
                            console.log(cookie('get', 'token'));
                            this.$router.replace('/');
                        })
                        .catch((res) => {
                            console.log(res);
                            console.log(666);
                            this.loading = false;
                            this.$message({
                                message: `${res.resMsg || '操作失败'}`,
                                type: 'error'
                            });
                            console.warn(res);
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        initRouter() {
            if (this.$route.query.token) {
                const token = this.$route.query.token;
                cookie('set', 'token', token, 0.5);
                this.$router.push('/');
                return;
            }
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;
</style>

<!--suppress CssInvalidPseudoSelector -->
<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    left: 0;

    background: url('./../../assets/page/login.avif') no-repeat center center;

    .login-form {
        // width: 520px;
        position: relative;
        width: 480px;
        height: 250px;
        // max-width: 100%;
        box-sizing: border-box;
        padding: 43px 49px;
        margin: 44px auto 130px;

        :deep(.el-form-item__error) {
            padding-left: 87px;
        }

        // background: rgba(3, 98, 162, 0.2);
        background: rgba(4, 96, 170, 0.4);
        border-radius: 10px;

        :deep(.el-input__inner) {
            font-size: 16px !important;
        }

        :deep(.el-button) {
            font-size: 16px !important;
        }

        :deep(.el-input-group__prepend) {
            font-size: 16px !important;
        }

        // transform: scale(1.3);
        //.el-form-item {
        //  margin-bottom: 52px;
        //  input:-internal-autofill-selected {
        //    background-color: rgb(232, 240, 254) !important;
        //    background-image: none !important;
        //    color: rgb(255, 0, 0) !important;
        //  }
        //  ::deep(.el-input) {
        //    .el-input__inner {
        //      border: 1px solid rgba(0, 160, 233, 0.6);
        //      border-radius: 14px;
        //      color: #fff !important;
        //      text-align: center;
        //      height: 77px;
        //      background: rgba(6, 53, 113, 0.6);
        //      font-size: 38px;
        //      &::placeholder {
        //        color: #3269a7 !important;
        //      }
        //
        //      &::-webkit-input-placeholder {
        //        /* WebKit browsers 适配谷歌 */
        //        color: #3269a7 !important;
        //      }
        //
        //      &:-moz-placeholder {
        //        /* Mozilla Firefox 4 to 18 适配火狐 */
        //        color: #3269a7 !important;
        //      }
        //
        //      &::-moz-placeholder {
        //        /* Mozilla Firefox 19+ 适配火狐 */
        //        color: #3269a7 !important;
        //      }
        //
        //      &:-ms-input-placeholder {
        //        /* Internet Explorer 10+  适配ie*/
        //        color: #3269a7 !important;
        //      }
        //    }
        //  }
        //  :deep(.el-form-item__error) {
        //    color: #fff;
        //  }
        //  :deep(.el-button) {
        //    height: 77px;
        //    border-radius: 18px;
        //    font-size: 24px;
        //    background-color: rgba(84, 162, 254, 0.8);
        //    // opacity: 0.8;
        //    border: 1px solid rgba(0, 160, 233, 0.8);
        //    &:hover {
        //      background-color: rgba(84, 162, 254, 1);
        //    }
        //  }
        //}
        //&::before {
        //  content: "";
        //  display: block;
        //  width: 581px;
        //  height: 8px;
        //  position: absolute;
        //  top: -6px;
        //  left: 0;
        //  // right: 0;
        //  // margin: auto;
        //  background: url("../../assets/page/sprite4.png") no-repeat -285px -205px;
        //}
        //&::after {
        //  content: "";
        //  display: block;
        //  width: 581px;
        //  height: 8px;
        //  position: absolute;
        //  bottom: -6px;
        //  // left: 0;
        //  right: 0;
        //  // margin: auto;
        //  background: url("../../assets/page/sprite4.png") no-repeat -285px -219px;
        //}
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .left-img {
        width: 100%;
        height: auto;
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title {
        width: 1200px;
        height: 110px;
        line-height: 110px;
        font-size: 60px;
        font-weight: 400;
        color: $light_gray;
        margin: 170px auto 0 auto;
        text-align: center;
        // font-weight: bold;
        // background: url("./../../assets/page/top.png") no-repeat center center;
        background-size: 1200px 100%;
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
}
.index-login {
    display: flex;
    justify-content: center;
}
</style>
