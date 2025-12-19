<template>
  <div class="profile-page">
    <el-card class="profile-card">
      <div slot="header" class="card-header">
        <h2>个人中心</h2>
      </div>
      
      <el-form
        ref="profileForm"
        :model="profileForm"
        :rules="rules"
        label-width="100px"
        @submit.native.prevent="updateProfile">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="profileForm.userName" disabled></el-input>
        </el-form-item>
        
        <el-form-item label="手机">
          <el-input v-model="profileForm.telephone" maxlength="11"
          show-word-limit></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading">
            保存修改
          </el-button>
        </el-form-item>
      </el-form>

      <el-divider content-position="left">修改密码</el-divider>

      <el-form
        ref="passwordForm"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
        @submit.native.prevent="changePassword">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password>
          </el-input>
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password>
          </el-input>
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password>
          </el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="changingPassword">
            修改密码
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '@/utils/api'

export default {
  name: 'Profile',
  data() {
    // 确认密码的验证规则
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      changingPassword: false,
      profileForm: {
        userName: '',
        telephone: '',
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        telephone: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'telephone', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      // user: null,
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  async created() {
    this.getInformation()
  },
  methods: {
    async getInformation() {
      try {
      const response = await api.get('/user/info?userId=' + this.user.userId)
      let user = response.result
      this.profileForm = {
        userName: user.userName,
        telephone: user.telephone || '',
      }
      this.passwordForm.oldPassword = user.password
    } catch (error) {
      console.error('获取用户信息失败', error.response.data)
    }
    },
    async updateProfile() {
      try {
        await this.$refs.profileForm.validate()
        this.loading = true
        
        const res = await api.post('/user/update', {
          telephone: this.profileForm.telephone,
          userId: this.user.userId,
        })
        if(res.code === 200){
          this.loading = false
          this.$message.success(res.reason)
        }else{
          this.loading = false
          this.$message.error(res.reason)
        }
      } catch (error) {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message)
        }
      } finally {
        this.loading = false
      }
    },
    async changePassword() {
      try {
        await this.$refs.passwordForm.validate()
        this.changingPassword = true
        
        const res = await api.post('/user/update', {
          userId:  this.user.userId,
          password: this.passwordForm.newPassword,
        })
        if(res.code === 200){
          this.$message.success(res.reason)
        }else{
          this.$message.error(res.reason)
        }
        this.passwordForm = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        this.$refs.passwordForm.resetFields()
      } catch (error) {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message)
        }
      } finally {
        this.changingPassword = false
      }
    }
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  color: #303133;
}

.el-divider {
  margin: 30px 0;
}
</style> 