<template>
  <div class="login-wrap">
    <div class="ms-title">music 后台管理登录</div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="adminName">
          <el-input placeholder="用户名" v-model="ruleForm.adminName"></el-input>
        </el-form-item>
        <el-form-item prop="adminPassword">
          <el-input placeholder="密码" type="password" v-model="ruleForm.adminPassword"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button @click="submitForm" type="primary">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {mixin} from '../mixins/index'
import {getLoginStatus} from '../api/index'

export default {
  mixins: [mixin],
  data: function () {
    return {
      ruleForm: {
        adminName: 'admin',
        adminPassword: '123'
      },
      rules: {
        adminName: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        adminPassword: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm () {
      let params = new URLSearchParams()
      params.append('adminName', this.ruleForm.adminName)
      params.append('adminPassword', this.ruleForm.adminPassword)
      getLoginStatus(params)
        .then((res) => {
          if (res.data.code == 200) {
            localStorage.setItem('Admin_name', this.ruleForm.adminName)
            this.$router.push('/Info')
            this.notify('登录成功', 'success')
          } else {
            this.notify('登录失败', 'error')
          }
        })
    }
  }
}
</script>

<style scoped>
  .login-wrap {
    position: relative;
    background: url("../assets/img/background.jpg");
    background-attachment: fixed;
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;
  }

  .ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    font-weight: 600;
    color: #fff;
  }

  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 160px;
    margin-left: -190px;
    margin-top: -150px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
  }
</style>
