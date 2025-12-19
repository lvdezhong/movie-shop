<template>
  <el-container>
    <el-main>
      <el-card>
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <!-- 影片管理 -->
          <el-tab-pane label="影片管理" name="movieManagement">
            <movie-management ref="movieManagement" :categories="categories" @refresh-movies="getMovies" />
          </el-tab-pane>

          <!-- 分类管理 -->
          <el-tab-pane label="分类管理" name="categoryManagement">
            <category-management :categories="categories" @refresh-categories="getCategories" />
          </el-tab-pane>

          <!-- 影片审核 -->
          <el-tab-pane label="影片审核" name="movieReview">
            <movie-review />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import MovieManagement from './components/MovieManagement.vue';
import CategoryManagement from './components/CategoryManagement.vue';
import MovieReview from './components/MovieReview.vue';
import api from '@/utils/api';

export default {
  components: {
    MovieManagement,
    CategoryManagement,
    MovieReview
  },
  data() {
    return {
      activeTab: 'movieManagement',
      categories: []
    }
  },
  created() {
    this.getCategories();
    this.getMovies();
  },
  methods: {
    async getCategories() {
      try {
        const response = await api.get('/type/list');
        console.log(response);
        this.categories = response.result;
      } catch (error) {
        console.error('获取分类列表失败:', error);
        this.$message.error('获取分类列表失败');
      }
    },
    async getMovies() {
      try {
        const response = await api.get('/movie/list');
        this.$refs.movieManagement.movies = response.result;
      } catch (error) {
        console.error('获取影片列表失败:', error);
        this.$message.error('获取影片列表失败');
      }
    },
    async handleTabClick(tab) {
      switch (tab.name) {
        case 'movieManagement':
          this.getCategories();
          this.getMovies()
          break;
        case 'movieReview':
          // 获取待审核评论列表
          try {
            // const response = await api.get('/review/pending');
            // this.$refs.movieReview.reviews = response.data;
          } catch (error) {
            console.error('获取待审核评论失败:', error);
            this.$message.error('获取待审核评论失败');
          }
          break;
        case 'categoryManagement':
          // 获取分类列表
          try {
            const response = await api.get('/type/list');
            this.categories = response.result;
          } catch (error) {
            console.error('获取分类列表失败:', error);
            this.$message.error('获取分类列表失败');
          }
          break;
        
      }
    }
  }
}
</script>

<style scoped>
.el-main {
  padding: 20px;
}

.el-card {
  min-height: 500px;
}
</style> 