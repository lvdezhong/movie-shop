<template>
  <div class="merchandise-detail">
    <el-container>
      <el-main>
        <el-row :gutter="40">
          <!-- 商品图片 -->
          <el-col :span="12">
            <div class="image-container">
              <img
                :src="merchandise.productUrl"
                :alt="merchandise.productName"
                class="detail-image"
              />
            </div>
          </el-col>

          <!-- 商品信息 -->
          <el-col :span="12">
            <div class="detail-info">
              <h1>{{ merchandise.productName }}</h1>
              <p class="description">{{ merchandise.remark }}</p>
              <div class="rating-container">
                <el-rate
                  v-model="merchandise.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}"
                ></el-rate>
                <span class="rating-count"
                  >({{ merchandise.ratingCount }}人评价)</span
                >
              </div>
              <p class="price">¥{{ merchandise.outPrice }}</p>
              <el-button
                type="primary"
                size="large"
                @click="addToCart"
                icon="el-icon-shopping-cart-full"
                v-if="user && user.status != '1'"
              >
                加入购物车
              </el-button>
            </div>
          </el-col>
        </el-row>

        <!-- 评论区域 -->
        <div class="comments-section">
          <h2>商品评价</h2>

          <!-- 评分表单 -->
          <div class="comment-form">
            <h3>发表评价</h3>
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
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitComment"
                  >提交评价</el-button
                >
              </el-form-item>
            </el-form>
          </div>

          <!-- 评论列表 -->
          <div class="comments-list">
            <div
              v-for="comment in merchandise.comments"
              :key="comment.id"
              class="comment-item"
            >
              <div class="comment-header">
                <span class="user-name">{{ comment.userName }}</span>
                <el-rate
                  v-model="comment.rating"
                  disabled
                  text-color="#ff9900"
                ></el-rate>
                <span class="comment-date">{{ comment.commentsTime }}</span>
              </div>
              <p class="comment-content">{{ comment.commentsContent }}</p>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import api from '@/utils/api'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'MerchandiseDetail',
  data() {
    return {
      merchandise: {},
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
            max: 200,
            message: '评价内容长度在 5 到 200 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {},
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  mounted() {
    this.detail()
  },
  methods: {
    async detail() {
      try {
        const response = await api.get(
          '/product/detail?productId=' + this.$route.params.id
        )
        this.merchandise = response.result
      } catch (error) {
        this.$message.error('获取电影详情失败')
      }
    },
    async addToCart() {
      const response = await api.post('/shopping_cart/add', {
        productId: this.$route.params.id,
        productNum: 1,
        outPrice: this.merchandise.outPrice,
        userId: this.user.userId,
      })

      if (response.code === 200) {
        this.$message.success('已加入购物车')
        /**
        this.$store.dispatch('addToCart', {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      });
      this.$message({
        message: '已加入购物车',
        type: 'success'
      });*/
      } else {
        this.$message.error('操作失败')
      }
    },
    submitComment() {
      this.$refs.commentForm.validate(async (valid) => {
        if (valid) {
          try {
            const response = await api.post('/product_comments/add', {
              productId: this.$route.params.id,
              rating: this.commentForm.rating,
              userId: this.user.userId,
              commentsContent: this.commentForm.commentsContent,
            })
            if (response.code === 200) {
              this.$message.success('评价提交成功')
              // 重置表单
              this.commentForm.rating = 0
              this.commentForm.commentsContent = ''
              this.detail()
            } else {
              this.$message.error('操作失败')
            }
          } catch (error) {
            console.error('操作失败:', error)
            this.$message.error('操作失败')
          }
        }
      })
    },
  },
}
</script>

<style scoped>
.merchandise-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.image-container {
  width: 100%;
  padding-top: 100%;
  position: relative;
}

.detail-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-info {
  padding: 20px;
}

.description {
  color: #666;
  margin: 20px 0;
}

.rating-container {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.rating-count {
  margin-left: 10px;
  color: #666;
}

.price {
  color: #f56c6c;
  font-size: 24px;
  font-weight: bold;
  margin: 20px 0;
}

.comments-section {
  margin-top: 40px;
}

.comment-form {
  margin: 20px 0;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

.comment-item {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-name {
  font-weight: bold;
  margin-right: 10px;
}

.comment-date {
  margin-left: auto;
  color: #999;
}

.comment-content {
  color: #666;
  line-height: 1.6;
}
</style>
