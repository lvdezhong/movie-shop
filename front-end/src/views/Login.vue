<template>
  <div class="login-container">
    <el-card class="login-card">
      <div slot="header" class="card-header">
        <h2>用户登录</h2>
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        label-width="80px"
        @submit.native.prevent="handleLogin">
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="loginForm.userName"
            prefix-icon="el-icon-user"
            placeholder="请输入用户名">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请输入密码"
            show-password>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div class="button-group">
            <div class="action-links">
              <router-link to="/register" class="link-text">注册账号</router-link>
            </div>
            <el-button
              type="primary"
              native-type="submit"
              :loading="loading"
              class="submit-button">
              登录
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import api from '@/utils/api';
import { mapActions } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loading: false,
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['updateLoginState']),
    async handleLogin() {
      try {
        await this.$refs.loginForm.validate()
        this.loading = true
        const response = await api.post('/login', this.loginForm);
        if(response.code === 200){

          this.$store.dispatch('updateLoginState',{
            token: response.result.token,
            user: response.result.user,
          })
          this.$message.success('登录成功')
          const redirect = this.$route.query.redirect || '/'
          this.$router.push(redirect)
        }else{
          this.$message.error(response.reason)
        }
          
      } catch (error) {
        console.error('登录失败', error.response && error.response.data);
        this.$message.error('登录失败，请重试');
      } finally {
        this.loading = false
      }
    }
  },
  created() {
    if (this.$route.query.redirect) {
      this.$message.warning('请先登录')
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  background-color: #f5f7fa;
}

.login-card {
  width: 500px;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0;
  color: #303133;
}

.button-group {
  display: flex;
  /* flex-direction: column; */
  gap: 10px;
}

.action-links {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 5px;
  width: 100px;
}

.link-text {
  color: #409EFF;
  text-decoration: none;
  font-size: 14px;
}

.link-text:hover {
  color: #66b1ff;
}

.submit-button {
  width: 100%;
}
</style> 