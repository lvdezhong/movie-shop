<template>
  <div class="favorites-container">
    <h2 class="page-title">我的收藏</h2>
    
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="movie in favoriteMovies" :key="movie.movieId">
        <el-card class="movie-card" @click.native="goToDetail(movie.movieId)" v-if="movie.movieId">
          <div class="image-container">
            <img :src="`${config.imageBaseUrl}/${movie.imgUrl}`" :alt="movie.movieName" class="movie-image">
          </div>
          <div class="movie-info">
            <h3>{{ movie.movieName }}</h3>
            <div class="movie-meta">
              <span class="movie-year">{{ movie.year }}</span>
            </div>
            <p class="movie-desc">{{ movie.remark }}</p>
            <el-button 
              type="danger" 
              icon="el-icon-delete" 
              circle
              @click.stop="handleRemoveFavorite(movie.movieId)"
            ></el-button>
          </div>
        </el-card>
        <el-card class="movie-card deleted-card" v-else>
          <div class="deleted-content">
            <i class="el-icon-delete"></i>
            <span class="deleted-text">电影已删除</span>
            <el-button 
              type="danger" 
              icon="el-icon-delete" 
              circle
              @click.stop="handleRemoveFavorite(movie.collectId)"
              class="delete-btn"
            ></el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div v-if="favoriteMovies.length === 0" class="empty-state">
      <el-empty description="暂无收藏电影"></el-empty>
    </div>
  </div>
</template>

<script>
import api from '@/utils/api'
import config from '@/config'
import { mapGetters } from 'vuex'

export default {
  name: 'Favorites',
  data() {
    return {
      favoriteMovies: [],
      config
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    this.fetchFavorites()
  },
  methods: {
    async fetchFavorites() {
      try {
        const response = await api.get(`/movie_collet/list?userId=${this.user.userId}`)
        if (response.code === 200) {
          this.favoriteMovies = response.result
        } else {
          this.$message.error('获取收藏列表失败')
        }
      } catch (error) {
        this.$message.error('获取收藏列表失败')
      }
    },
    async handleRemoveFavorite(movieId) {
      try {
        const response = await api.post('/movie_collet/delete', {
          movieId: movieId,
          userId: this.user.userId
        })
        if (response.code === 200) {
          this.$message.success('取消收藏成功')
          this.favoriteMovies = this.favoriteMovies.filter(movie => movie.movieId !== movieId)
        } else {
          this.$message.error('操作失败')
        }
      } catch (error) {
        this.$message.error('操作失败')
      }
    },
    goToDetail(movieId) {
      this.$router.push(`/movie/${movieId}`)
    }
  }
}
</script>

<style scoped>
.favorites-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}

.movie-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2);
}

.image-container {
  width: 100%;
  padding-top: 140%; /* 保持电影海报比例 */
  position: relative;
  overflow: hidden;
}

.movie-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-info {
  padding: 15px;
}

.movie-info h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
}

.movie-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.movie-year {
  color: #666;
  font-size: 14px;
}

.movie-desc {
  color: #666;
  font-size: 14px;
  margin: 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-state {
  margin-top: 50px;
}

.deleted-card {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  cursor: default;
}

.deleted-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  position: relative;
  width: 100%;
  height: 100%;
}

.deleted-content i {
  font-size: 48px;
  margin-bottom: 16px;
}

.deleted-text {
  font-size: 16px;
  margin-bottom: 20px;
}

.delete-btn {
  position: absolute;
  bottom: 15px;
  right: 15px;
}
</style>