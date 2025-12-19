<template>
  <div class="register-container">
    <el-card class="register-card">
      <div slot="header" class="card-header">
        <h2>用户注册</h2>
      </div>
      <el-form
        ref="registerForm"
        :model="registerForm"
        :rules="rules"
        label-width="100px"
        @submit.native.prevent="handleRegister">
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="registerForm.userName"
            prefix-icon="el-icon-user"
            placeholder="请输入用户名">
          </el-input>
        </el-form-item>
        <el-form-item label="手机" >
          <el-input
            v-model.number="registerForm.telephone"
            prefix-icon="el-icon-phone"
            maxlength="11"
          show-word-limit
            placeholder="请输入手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请输入密码"
            show-password>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请再次输入密码"
            show-password>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div class="button-group">
            <div class="action-links">
              <router-link to="/login" class="link-text">返回登录</router-link>
            </div>
            <el-button
              type="primary"
              native-type="submit"
              :loading="loading"
              class="submit-button">
              注册
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import api from '@/utils/api';

export default {
  name: 'Register',
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        userName: '',
        password: '',
        confirmPassword: ''
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
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async handleRegister() {
      try {
        await this.$refs.registerForm.validate()
        this.loading = true
        
        const response = await api.post('/register', this.registerForm)
        if(response.code == 200) {
          this.$message.success('注册成功')
          this.$router.push('/login')
        }else{
          this.$message.error(response.reason)
        }
      } catch (error) {
        console.error('注册失败', error.response && error.response.data)
        this.$message.error('注册失败，请重试')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  background-color: #f5f7fa;
}

.register-card {
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