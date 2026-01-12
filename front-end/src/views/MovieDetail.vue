<template>
  <div class="movie-detail-container">
    <div class="content-wrapper">
      <!-- 视频播放区 -->
      <div class="video-section">
        <video
          class="video-player"
          controls
          :src="videoUrl"
          :poster="getImageUrl(movieInfo.imgUrl)"
        >
          您的浏览器不支持 HTML5 视频播放
        </video>
      </div>

      <!-- 信息展示区 -->
      <div class="info-section">
        <el-tabs v-model="activeTab">
          <el-tab-pane class="tab-pane" label="电影详情" name="detail">
            <div class="movie-info">
              <div class="movie-title">
                {{ movieInfo.movieName }}
                <el-button
                  :type="isFavorite ? 'danger' : 'default'"
                  :icon="isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"
                  circle
                  @click="handleFavorite"
                  class="favorite-btn"
                ></el-button>
              </div>
              <div class="movie-meta">
                <span>导演：{{ movieInfo.director }}</span>
                <span>主演：{{ movieInfo.starring }}</span>
                <span>年份：{{ movieInfo.year }}</span>
              </div>
              <div class="rating-header">
                <div class="rating-title">用户评分</div>
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
                  <div class="rating-count">
                    {{ movieInfo.ratingCount }}人评分
                  </div>
                </div>
              </div>
              <!-- <Rating
                :movie="movieInfo"
                @rating-updated="handleRatingUpdated"
              /> -->
              <div class="movie-description">简介： {{ movieInfo.remark }}</div>
            </div>
          </el-tab-pane>

          <el-tab-pane class="tab-pane" label="评论区" name="comments">
            <div class="comments-section">
              <!-- 添加评论输入区域 -->
              <div class="comment-form">
                <el-form :model="commentForm" :rules="rules" ref="commentForm">
                  <el-form-item label="评分" prop="rating">
                    <el-rate class="comment-rating"v-model="commentForm.rating"></el-rate>
                  </el-form-item>
                  <el-form-item label="评价内容" prop="content">
                    <el-input
                      class="comment-input"
                      type="textarea"
                      v-model="commentForm.commentsContent"
                      :rows="4"
                      placeholder="请输入您的评价内容"
                      :maxlength="500"
                      show-word-limit
                    ></el-input>
                  </el-form-item>
                  <el-button
                    type="primary"
                    @click="handleComment"
                    :loading="commenting"
                  >
                    发表评论
                  </el-button>
                </el-form>
              </div>

              <!-- 评论列表 -->
              <div class="comments-list">
                <div
                  v-for="(comment, index) in comments"
                  :key="index"
                  class="comment-item"
                >
                  <div class="comment-header">
                    <div class="comment-user-info">
                      <span class="comment-user">{{ comment.userName || '匿名' }}</span>
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
    <el-divider />
    <div class="product-list">
      <h2>周边推荐</h2>
      <el-empty v-if="merchandiseList.length === 0" description="暂无相关周边哦～"></el-empty>
      <el-row v-else :gutter="20">
        <el-col
          v-for="item in merchandiseList"
          :key="item.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <el-card
            class="merchandise-item"
            @click.native="goToDetail(item.productId)"
          >
            <div class="image-container">
              <img
                :src="getImageUrl(item.productUrl)"
                alt="商品图片"
                class="item-image"
              />
            </div>
            <div class="item-info">
              <h3>{{ item.productName }}</h3>
              <p class="description">{{ item.remark }}</p>
              <div class="rating-container">
                <el-rate
                  v-model="item.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}"
                ></el-rate>
                <span class="rating-count">({{ item.ratingCount }}人评价)</span>
              </div>
              <p class="price">¥{{ item.outPrice }}</p>
              <el-button
                type="primary"
                @click.stop="addToCart(item)"
                icon="el-icon-shopping-cart-full"
                v-if="user && user.status != '1'"
              >
                加入购物车
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Rating from '@/components/Rating.vue'
import api from '@/utils/api'
import { getImageUrl } from '@/utils'

export default {
  name: 'MovieDetail',
  components: {
    Rating,
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
        commentsContent: '',
      },
      rules: {
        rating: [{ required: true, message: '请选择评分', trigger: 'change' }],
        commentsContent: [
          { required: true, message: '请输入评价内容', trigger: 'blur' },
          {
            min: 5,
            max: 500,
            message: '评价内容长度在 5 到 500 个字符',
            trigger: 'blur',
          },
        ],
      },
      isFavorite: false,
      merchandiseList: [],
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
      favorites: (state) => state.favorites,
    }),
  },
  created() {
    this.fetchMovieDetail()
    this.fetchComments()
    this.isFavoriteStatus()
    this.fetchMerchandiseList()
  },
  methods: {
    ...mapActions([
      'toggleFavorite',
      'addComment',
      'getComments',
      'getFavorites',
    ]),
    getImageUrl,
    async isFavoriteStatus() {
      const response = await api.get(
        '/movie/isFavorite?userId=' +
          this.user.userId +
          '&movieId=' +
          this.$route.params.id
      )
      if (response.code === 200) {
        this.isFavorite = response.result.isFavorite != 0
      }
    },

    async fetchMovieDetail() {
      try {
        const response = await api.get(
          '/movie/detail?userId=' +
            this.user.userId +
            '&movieId=' +
            this.$route.params.id
        )
        this.movieInfo = response.result.movie
      } catch (error) {
        this.$message.error('获取电影详情失败')
      }
    },
    async fetchComments() {
      try {
        const response = await api.get(
          '/movie_comments/list?movieId=' + this.$route.params.id
        )
        // const response = await this.getComments(this.$route.params.id)
        if (response.code === 200) {
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
          url = '/movie_collet/add'
        }
        const response = await api.post(url, {
          movieId: this.$route.params.id,
          userId: this.user.userId,
        })
        if (response.code === 200) {
          this.$message.success(this.isFavorite ? '取消收藏成功' : '收藏成功')
          this.isFavorite = !this.isFavorite
        } else {
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
              score: this.commentForm.rating,
            })
            if (response.code === 200) {
              this.$message.success('评论发表成功')
              // 重置表单
              this.commentForm.rating = 0
              this.commentForm.commentsContent = ''
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
      })
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
    },
    fetchMerchandiseList() {
      api
        .get('/product/list?movieId=' + this.$route.params.id)
        .then((response) => {
          this.merchandiseList = response.result
        })
        .catch((error) => {
          console.error('获取商品列表失败:', error)
          this.$message.error('获取商品列表失败')
        })
    },
    async addToCart(item) {
      const response = await api.post('/shopping_cart/add', {
        productId: item.productId,
        productNum: 1,
        outPrice: item.outPrice,
        userId: this.user.userId,
      })
      if (response.code === 200) {
        this.$message.success('已加入购物车')
      } else {
        this.$message.error('操作失败')
      }
    },
    goToDetail(id) {
      this.$router.push(`/merchandise/${id}`)
    },
  },
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
  height: calc(100vh - 100px);
}

.video-section {
  flex: 3;
  min-width: 0;
}

.video-player {
  width: 100%;
  height: 100%;
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

.tab-pane {
  height: 669px;
}

.movie-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.movie-title {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
}

.movie-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #666;
}

.rating-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.movie-description {
  line-height: 1.6;
  color: #333;
  flex: 1;
  overflow-y: auto;
}

.comments-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.comment-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;

  .comment-rating {
    margin-top: 10px;
  }

  .comment-input {
    line-height: 1.6;
  }
}

.comments-list {
  flex: 1;
  overflow-y: auto;
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

.merchandise-item {
  margin-bottom: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
}

.merchandise-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2);
}

.image-container {
  width: 100%;
  padding-top: 100%; /* 保持1:1比例 */
  position: relative;
}

.item-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  padding: 10px;
  text-align: center;
}

.description {
  color: #666;
  font-size: 14px;
  margin: 8px 0;
}

.rating-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 0;
}

.rating-count {
  margin-left: 8px;
  color: #666;
  font-size: 12px;
}

.price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    height: auto;
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

  .tab-pane {
    height: auto;
  }
}
</style>
