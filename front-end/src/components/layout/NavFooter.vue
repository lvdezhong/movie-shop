<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>关于我们</h3>
        <p>我们是一个专注于提供优质影视内容和周边产品的平台。</p>
      </div>
      <div class="footer-section">
        <h3>联系方式</h3>
        <p>邮箱：contact@movieshop.com</p>
        <p>电话：400-123-4567</p>
      </div>
      <div class="footer-section">
        <h3>关注我们</h3>
        <div class="social-links">
          <i class="el-icon-s-custom"></i>
          <i class="el-icon-chat-dot-round"></i>
          <i class="el-icon-mobile"></i>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 影视商城. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'NavFooter'
}
</script>

<style scoped>
.footer {
  background-color: #545c64;
  color: #fff;
  padding: 40px 0 20px;
  margin-top: 40px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.footer-section {
  flex: 1;
  min-width: 250px;
  margin: 0 20px;
}

.footer-section h3 {
  color: #ffd04b;
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  gap: 20px;
  font-size: 24px;
}

.social-links i {
  cursor: pointer;
  transition: color 0.3s;
}

.social-links i:hover {
  color: #ffd04b;
}

.footer-bottom {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style> 