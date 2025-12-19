<template>
  <div class="nav-header">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      router
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="/">首页</el-menu-item>
      <!-- <el-menu-item index="/movies">电影</el-menu-item> -->
      <el-menu-item index="/merchandise">周边</el-menu-item>
      <el-menu-item index="/favorites">收藏</el-menu-item>
      <el-menu-item index="/orders">订单</el-menu-item>
      <el-menu-item index="/shopping-cart"  v-if="user && user.status != '1'">
        购物车
        <el-badge :value="cartItemCount" v-if="cartItemCount > 0" class="cart-badge" />
      </el-menu-item>
      <el-menu-item index="/content-management" v-if="user && user.status == '1'">内容管理</el-menu-item>
      
      <div class="right-menu">
        <template v-if="isLoggedIn">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{user && user.userName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button type="text" @click="$router.push('/login')">登录</el-button>
          <el-button type="text" @click="$router.push('/register')">注册</el-button>
        </template>
      </div>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NavHeader',
  computed: {
    ...mapGetters(['isLoggedIn', 'user']),
    activeIndex() {
      return this.$route.path
    },
    cartItemCount() {
      return this.$store.getters.cartItemCount
    },
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        this.$store.dispatch('logout')
        this.$router.push('/login')
      } else if (command === 'profile') {
        this.$router.push('/profile')
      }
    }
  }
}
</script>

<style scoped>
.nav-header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.right-menu {
  float: right;
  height: 60px;
  line-height: 60px;
  margin-right: 20px;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}

.el-button--text {
  color: #fff;
  margin-left: 15px;
}

.el-button--text:hover {
  color: #ffd04b;
}

.cart-badge {
  margin-left: 5px;
}
</style> 