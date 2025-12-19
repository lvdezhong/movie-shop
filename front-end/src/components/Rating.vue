<template>
  <div class="rating-component">
    <div class="rating-header">
      <h3>用户评分</h3>
      <div class="rating-stats">
        <div class="average-rating">
          <span class="rating-value">{{ movie.rating }}</span>
          <el-rate
            v-model="movie.rating"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
        </div>
        <div class="rating-count">{{ movie.ratingCount }}人评分</div>
      </div>
    </div>

    <div class="user-rating">
      <h4>我的评分</h4>
      <div class="rating-input">
        <el-rate
          v-model="userRating"
          :colors="colors"
          show-text
          :texts="texts"
          @change="handleRatingChange"
        ></el-rate>
      </div>
    </div>
    <!-- <div v-else class="login-tip">
      请<router-link to="/login">登录</router-link>后评分
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Rating',
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      userRating: 0,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      texts: ['很差', '较差', '一般', '不错', '很好']
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  methods: {
    async handleRatingChange(value) {
      try {
        await this.$store.dispatch('rateMovie', {
          movieId: this.movie.id,
          rating: value
        })
        this.$message.success('评分成功')
        this.$emit('rating-updated')
      } catch (error) {
        this.$message.error('评分失败')
        this.userRating = 0
      }
    }
  }
}
</script>

<style scoped>
.rating-component {
  margin: 20px 0;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.rating-header {
  margin-bottom: 20px;
}

.rating-header h3 {
  margin: 0 0 15px;
  color: #303133;
}

.rating-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.average-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px;
}

.rating-value {
  font-size: 36px;
  font-weight: bold;
  color: #ff9900;
  white-space: nowrap;
}

.rating-count {
  color: #909399;
  white-space: nowrap;
}

.user-rating {
  padding-top: 20px;
  border-top: 1px solid #EBEEF5;
}

.user-rating h4 {
  margin: 0 0 15px;
  color: #303133;
}

.rating-input {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.login-tip {
  text-align: center;
  padding: 20px;
  color: #909399;
}

.login-tip a {
  color: #409EFF;
  text-decoration: none;
}

@media screen and (max-width: 480px) {
  .rating-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .average-rating {
    min-width: 100%;
  }

  .rating-value {
    font-size: 28px;
  }
}
</style> 