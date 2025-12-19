<template>
  <div class="home">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索电影..."
        prefix-icon="el-icon-search"
        @keyup.enter.native="handleSearch"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-input>
    </div>

    <!-- 轮播图 -->
    <el-carousel :interval="4000" type="card" height="400px" class="banner">
      <el-carousel-item v-for="item in carouselItems" :key="item.id" @click.native="goToDetail(item.movieId)">
        <img :src="item.imgUrl" :alt="item.title" class="banner-image">
        <div class="banner-content">
          <h2>{{ item.movieName }}</h2>
          <p>{{ item.remark }}</p>
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- 分类导航 -->
    <div class="category-nav">
      <el-tabs v-model="activeCategory" @tab-click="handleCategoryClick">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane 
          v-for="category in categories" 
          :key="category.typeId"
          :label="category.typeName"
          :name="category.typeId.toString()"
        >
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 电影列表 -->
    <div class="movie-list">
      <template v-if="movies.length > 0">
        <el-row :gutter="20">
          <el-col :span="6" v-for="movie in movies" :key="movie.id">
            <el-card :body-style="{ padding: '0px' }" class="movie-card" @click.native="goToDetail(movie.movieId)">
              <img :src="movie.imgUrl" class="movie-image">
              <div class="movie-info">
                <h3>{{ movie.movieName }}</h3>
                <div class="movie-meta">
                  <span class="movie-year">{{ movie.year }}</span>
                  <el-rate
                    v-model="movie.rating"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                  ></el-rate>
                </div>
                <p class="movie-desc">{{ movie.remark }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </template>
      <template v-else>
        <div class="empty-state">
          <el-empty remark="暂无相关电影"></el-empty>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import api from '@/utils/api'

export default {
  name: 'Home',
  data() {
    return {
      searchQuery: '',
      activeCategory: 'all',
      categories: [
      ],
      movies: [],
      allMovies: [],
      carouselItems: []
    }
  },
  created() {
    this.handleCategoryClick();
    this.getCategories();
    this.getMovies()
  },
  methods: {
    handleSearch() {
      this.activeCategory = 'all'
      if (this.searchQuery.trim()) {
        this.movies = this.allMovies.filter(movie => 
          movie.movieName.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      } else {
        this.handleCategoryClick();
      }
    },
    async getCategories() {
      try {
        const response = await api.get('/type/list');
        this.categories = response.result;
      } catch (error) {
        this.$message.error('获取分类列表失败');
      }
    },
    async getMovies() {
      try {
        const response = await api.get('/movie/list');
        this.allMovies = response.result;
        this.movies = this.allMovies;
        if(this.allMovies.length > 3) {
          this.carouselItems = this.allMovies.slice(0, 3);
        }
      } catch (error) {
        this.$message.error('获取电影列表失败');
      }
    },
    handleCategoryClick() {
      if (this.activeCategory === 'all') {
        this.movies = this.allMovies;
      } else {
        this.movies = this.allMovies.filter(movie => 
          movie.typeId.toString() == this.activeCategory
        );
      }
    },
    goToDetail(movieId) {
      this.$router.push(`/movie/${movieId}`);
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-bar {
  margin-bottom: 30px;
}

.banner {
  margin-bottom: 40px;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  cursor: pointer;
}

.banner-content:hover {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
}

.category-nav {
  margin-bottom: 30px;
}

.movie-list {
  margin-top: 20px;
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

.movie-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.movie-info {
  padding: 14px;
}

.movie-info h3 {
  margin: 0;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.movie-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.movie-year {
  color: #666;
  font-size: 14px;
}

.movie-desc {
  color: #666;
  font-size: 14px;
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}
</style> 