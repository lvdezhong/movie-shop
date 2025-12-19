<script>
import { mapActions } from 'vuex'
import NavHeader from '@/components/layout/NavHeader.vue'
import NavFooter from '@/components/layout/NavFooter.vue'

export default {
  name: 'App',
  components: {
    NavHeader,
    NavFooter,
  },
  created() {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (token && user) {
      this.updateLoginState({ token, user })
    }
  },
  methods: {
    ...mapActions(['updateLoginState']),
  },
}
</script>

<template>
  <div id="app">
    <NavHeader />
    <router-view />
    <NavFooter />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-header {
  padding: 0;
  height: auto !important;
}

.el-main {
  padding: 20px;
  min-height: calc(100vh - 120px);
}

.el-footer {
  text-align: center;
  color: #666;
  padding: 20px 0;
}
</style>
