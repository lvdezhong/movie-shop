<template>
  <div class="movie-detail-container">
    <div class="content-wrapper">
      <!-- 视频播放区 -->
      <div class="video-section">
        <video
          class="video-player"
          controls
          :src="videoUrl"
          :poster="movieInfo.imgUrl"
        >
          您的浏览器不支持 HTML5 视频播放
        </video>
      </div>

      <!-- 信息展示区 -->
      <div class="info-section">
        <el-tabs v-model="activeTab" class="movie-tabs">
          <el-tab-pane label="电影详情" name="detail">
            <div class="movie-info">
              <h2 class="movie-title">
                {{ movieInfo.movieName }}
                <el-button
                  :type="isFavorite ? 'danger' : 'default'"
                  :icon="isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"
                  circle
                  @click="handleFavorite"
                  class="favorite-btn"
                ></el-button>
              </h2>
              <div class="movie-meta">
                <span>导演：{{ movieInfo.director }}</span>
                <span>主演：{{ movieInfo.starring }}</span>
                <span>年份：{{ movieInfo.year }}</span>
              </div>
              <div class="rating-header">
                <h3>用户评分</h3>
                <div class="rating-stats">
                  <div class="average-rating">
                    <!-- <span class="rating-value">{{ movieInfo.rating }}</span> -->
                    <el-rate
                      v-model="movieInfo.rating"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}"
                    ></el-rate>
                  </div>
                  <div class="rating-count">{{ movieInfo.ratingCount }}人评分</div>
                </div>
              </div>
              <!-- <Rating 
                :movie="movieInfo"
                @rating-updated="handleRatingUpdated"
              /> -->
              <div class="movie-description">
               简介： {{ movieInfo.remark }}
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="评论区" name="comments">
            <div class="comments-section">
              <!-- 添加评论输入区域 -->
              <div class="comment-form">
                <el-form :model="commentForm" :rules="rules" ref="commentForm">
                  <el-form-item label="评分" prop="rating">
                    <el-rate v-model="commentForm.rating"></el-rate>
                  </el-form-item>
                  <el-form-item label="评价内容" prop="content">
                    <el-input
                      type="textarea"
                      v-model="commentForm.commentsContent"
                      :rows="4"
                      placeholder="请输入您的评价内容"
                      :maxlength="500"
                      show-word-limit
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button 
                      type="primary" 
                      @click="handleComment" 
                      :loading="commenting"
                    >
                      发表评论
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>

              <!-- 评论列表 -->
              <div class="comments-list">
                <div v-for="(comment, index) in comments" :key="index" class="comment-item">
                  <div class="comment-header">
                    <div class="comment-user-info">
                      <span class="comment-user">{{ comment.userName }}</span>
                      <el-rate
                        v-model="comment.score"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}"
                        class="comment-rating"
                      ></el-rate>
                    </div>
                    <span class="comment-time">{{ comment.commentsTime }}</span>
                  </div>
                  <div class="comment-content">
                    {{ comment.commentsContent }}
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Rating from '@/components/Rating.vue'
import api from '@/utils/api';

export default {
  name: 'MovieDetail',
  components: {
    Rating
  },
  data() {
    return {
      activeTab: 'detail',
      videoUrl: require('@/assets/videos/1.mp4'),
      commenting: false,
      movieInfo: {},
      comments: [],
      commentForm: {
        rating: 0,
        commentsContent: ''
      },
      rules: {
        rating: [
          { required: true, message: '请选择评分', trigger: 'change' }
        ],
        commentsContent: [
          { required: true, message: '请输入评价内容', trigger: 'blur' },
          { min: 5, max: 500, message: '评价内容长度在 5 到 500 个字符', trigger: 'blur' }
        ]
      },
      isFavorite: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      favorites: state => state.favorites
    }),
    
  },
  created() {
    this.fetchMovieDetail()
    this.fetchComments()
    this.isFavoriteStatus()
  },
  methods: {
    ...mapActions([
      'toggleFavorite',
      'addComment',
      'getComments',
      'getFavorites'
    ]),

    async isFavoriteStatus() {
      const response = await api.get('/movie/isFavorite?userId=' + this.user.userId + '&movieId=' + this.$route.params.id)
      if(response.code === 200){
          this.isFavorite = response.result.isFavorite!=0
      }
    },

    async fetchMovieDetail() {
      try {
        const response = await api.get('/movie/detail?userId=' + this.user.userId + '&movieId=' + this.$route.params.id)
        this.movieInfo = response.result.movie
      } catch (error) {
        this.$message.error('获取电影详情失败')
      }
    },
    async fetchComments() {
      try {
        const response = await api.get('/movie_comments/list?movieId=' + this.$route.params.id)
        // const response = await this.getComments(this.$route.params.id)
        if(response.code === 200){
          this.comments = response.result
        }
        // this.comments = response
      } catch (error) {
        this.$message.error('获取评论失败')
      }
    },
    // async fetchFavorites() {
    //   try {
    //     const favorites = await this.getFavorites()
    //     this.$store.commit('setFavorites', favorites)
    //   } catch (error) {
    //     console.error('获取收藏列表失败:', error)
    //   }
    // },
    async handleFavorite() {
      if (!this.user) {
        this.$message.warning('请先登录')
        this.$router.push('/login')
        return
      }
      try {
        let url
        if (this.isFavorite) {
          url = '/movie_collet/delete'
        } else {
          url = '/movie_collet/add';
        }
        const response = await api.post(url, {
          movieId: this.$route.params.id,
          userId: this.user.userId
        })
        if(response.code === 200){
          this.$message.success(this.isFavorite ? '取消收藏成功' : '收藏成功')
          this.isFavorite = !this.isFavorite
        }else{
          this.$message.error('操作失败')
        }
      } catch (error) {
        console.error('操作失败:', error)
        this.$message.error('操作失败')
      }
    },
    async handleComment() {
      this.$refs.commentForm.validate(async (valid) => {
        if (valid) {
          this.commenting = true
          try {
            const response = await api.post('/movie_comments/add', {
              movieId: this.$route.params.id,
              userId: this.user.userId,
              commentsContent: this.commentForm.commentsContent,
              score: this.commentForm.rating
            })
            if (response.code === 200) {
              this.$message.success('评论发表成功')
              // 重置表单
              this.commentForm.rating = 0;
              this.commentForm.commentsContent = '';
              this.fetchComments()
            } else {
              this.$message.error('评论发表失败')
            }
          } catch (error) {
            this.$message.error('评论发表失败')
          } finally {
            this.commenting = false
          }
        }
      });
    },
    handlePlay() {
      if (!this.user) {
        this.$message.warning('请先登录')
        this.$router.push('/login')
        return
      }
      if (this.movieInfo.isPay) {
        // TODO: 处理付费电影播放逻辑
        this.$message.info('付费电影播放功能开发中')
      } else {
        // TODO: 处理免费电影播放逻辑
        this.$message.info('免费电影播放功能开发中')
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString()
    },
    handleRatingUpdated() {
      this.fetchMovieDetail()
    }
  }
}
</script>

<style scoped>
.movie-detail-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.content-wrapper {
  display: flex;
  gap: 20px;
}

.video-section {
  flex: 3;
  min-width: 0;
}

.video-player {
  width: 100%;
  height: calc(100vh - 100px);
  max-height: 800px;
  min-height: 500px;
  background: #000;
  object-fit: cover;
}

/* 添加视频封面样式 */
.video-player::-webkit-media-controls-panel {
  background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.video-player::-webkit-media-controls-start-playback-button {
  display: none;
}

.info-section {
  flex: 1;
  min-width: 0;
  max-width: 400px;
}

.movie-tabs {
  height: 100%;
}

.movie-info {
  padding: 20px 0;
}

.movie-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.movie-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  color: #666;
}

.movie-description {
  margin-top: 20px;
  line-height: 1.6;
  color: #333;
}

.comments-section {
  padding: 20px 0;
}

.comment-form {
  margin-bottom: 30px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.comment-form-footer {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

.comments-list {
  margin-top: 20px;
}

.comment-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.comment-user-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.comment-user {
  font-weight: bold;
  color: #333;
}

.comment-rating {
  margin-top: 2px;
}

.comment-time {
  color: #999;
  font-size: 14px;
}

.comment-content {
  color: #666;
  line-height: 1.5;
  margin-top: 8px;
}

.favorite-btn {
  margin-left: 10px;
  transition: all 0.3s ease;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }

  .video-section,
  .info-section {
    width: 100%;
    max-width: none;
  }

  .video-player {
    height: auto;
    max-height: 400px;
    min-height: auto;
  }
}
</style> 