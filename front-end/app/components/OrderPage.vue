<template>
  <div class="order-page">
    <div class="order-list">
      <!-- 订单列表内容 -->
    </div>
    <div class="content-management">
      <h3>内容管理</h3>
      <div class="video-management">
        <h4>影片管理</h4>
        <button @click="addVideo">新增影片</button>
        <button @click="editVideo">编辑影片</button>
        <button @click="deleteVideo">删除影片</button>
        <button @click="searchVideo">查询影片</button>
      </div>
      <div class="category-management">
        <h4>分类标签</h4>
        <button @click="addCategory">新增分类</button>
        <button @click="editCategory">编辑分类</button>
        <button @click="deleteCategory">删除分类</button>
      </div>
      <div class="approval-management">
        <h4>审核机制</h4>
        <button @click="approveVideo">审核通过</button>
        <button @click="rejectVideo">审核不通过</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    addVideo() {
      // 新增影片逻辑
      console.log('新增影片');
    },
    editVideo() {
      // 编辑影片逻辑
      console.log('编辑影片');
    },
    deleteVideo() {
      // 删除影片逻辑
      console.log('删除影片');
    },
    searchVideo() {
      // 查询影片逻辑
      console.log('查询影片');
    },
    addCategory() {
      // 新增分类逻辑
      console.log('新增分类');
    },
    editCategory() {
      // 编辑分类逻辑
      console.log('编辑分类');
    },
    deleteCategory() {
      // 删除分类逻辑
      console.log('删除分类');
    },
    approveVideo() {
      // 审核通过逻辑
      console.log('审核通过');
    },
    rejectVideo() {
      // 审核不通过逻辑
      console.log('审核不通过');
    }
  }
}
</script>

<style scoped>
.order-page {
  display: flex;
}

.order-list {
  flex: 1;
}

.content-management {
  width: 300px;
  margin-left: 20px;
  padding: 10px;
  border-left: 1px solid #ccc;
}

.video-management, .category-management, .approval-management {
  margin-bottom: 20px;
}

button {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style> 