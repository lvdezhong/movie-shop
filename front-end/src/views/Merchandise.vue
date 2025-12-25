<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
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
    </el-main>
  </el-container>
</template>

<script>
import api from '@/utils/api'
import { mapState, mapGetters, mapActions } from 'vuex'
import { getImageUrl } from '@/utils'

export default {
  name: 'Merchandise',
  data() {
    return {
      merchandiseList: [],
    }
  },
  computed: {
    ...mapGetters(['user']),
    ...mapState({
      user: (state) => state.user,
    }),
  },
  mounted() {
    this.fetchMerchandiseList()
  },
  methods: {
    getImageUrl,
    fetchMerchandiseList() {
      api
        .get('/product/list')
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
        /**
         * this.$store.dispatch('addToCart', {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      });
      this.$message({
        message: '已加入购物车',
        type: 'success'
      });
         */
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
</style>
