<template>
  <el-container class="shopping-cart-page">
    <el-main>
      <el-card>
        <div slot="header" class="clearfix">
          <h1>我的购物车</h1>
        </div>
        
        <el-table
          :data="cartItems"
          empty-text="购物车为空"
          style="width: 100%">
          <el-table-column
            prop="productName"
            label="商品名称"
            >
          </el-table-column>
          <el-table-column
            prop="outPrice"
            label="单价"
            >
            <template slot-scope="scope">
              ¥{{ scope.row.outPrice.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
            >
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.productNum"
                :min="1"
                @change="updateQuantity(scope.row)"
                size="small"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            label="小计"
            >
            <template slot-scope="scope">
              ¥{{ scope.row.subtotal.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="removeItem(scope.row.id)"
                size="small"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="cart-summary">
          <el-row type="flex" justify="end">
            <el-col :span="6">
              <el-card>
                <div class="summary-content">
                  <p>商品总数：{{ cartItemCount }} 件</p>
                  <p class="total-price">总计：¥{{ cartTotal.toFixed(2) }}</p>
                  <el-button
                    type="success"
                    @click="checkout"
                    :disabled="cartItems.length === 0"
                    class="checkout-btn"
                  >
                    去结算
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters,mapState } from 'vuex';
import api from '@/utils/api';

export default {
  data() {
    return {
      cartItems: []
    }
  },
  computed: {
    // ...mapGetters(['cartItems', 'cartItemCount', 'cartTotal']),
    ...mapState({
      user: state => state.user,
      favorites: state => state.favorites
    }),
    cartItemCount() {
      let total = 0;
      this.cartItems.forEach(item => {
        total += item.productNum;
      })
      return total;
    },
    cartTotal() {
      let total = 0;
      this.cartItems.forEach(item => {
        total += item.outPrice*item.productNum;
      })
      return total;
    },
  },
  mounted() {
    this.fetchShoppingCarList();
  },
  
  methods: {
    fetchShoppingCarList() {
      api.get('/shopping_cart/list?userId=' + this.user.userId).then(response => {
        this.cartItems = response.result;
        
      }).catch(error => {
        console.error('获取商品列表失败:', error);
        this.$message.error('获取商品列表失败');
      });
    },
    updateQuantity(item) {
      item.subtotal = item.productNum * item.outPrice
 
    },
    removeItem(id) {
      api.post('/shopping_cart/delete',{id}).then(response => {
        this.$message.success('删除成功');
        this.fetchShoppingCarList();
      }).catch(error => {
        console.error('获取商品列表失败:', error);
        this.$message.error('获取商品列表失败');
      });
    },
    async checkout() {
      this.$confirm('确认生成订单并前往支付吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 模拟生成订单
        // const newOrder = {
        //   id: Date.now(),
        //   orderNumber: `ORD${Date.now()}`,
        //   date: new Date().toISOString(),
        //   total: this.cartTotal,
        //   status: '待处理',
        //   items: this.cartItems,
        //   paymentDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24小时支付期限
        // };

        // 将订单添加到订单列表
        //this.$store.dispatch('addOrder', newOrder);
        const response = await api.post('/order/add', {
          proudctList: this.cartItems,
          userId: this.user.userId
        })
        if (response.code === 200) {
          this.$message.success('订单已生成，请尽快支付！')
          // 跳转到订单页面
          this.$router.push('/orders');
        } else {
          this.$message.error('订单生成失败')
        }
        
        
      }).catch(() => {
        this.$message.info('已取消结算');
      });
    }
  }
}
</script>

<style scoped>
.shopping-cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.cart-summary {
  margin-top: 20px;
}

.summary-content {
  text-align: right;
}

.total-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
  margin: 10px 0;
}

.checkout-btn {
  width: 100%;
  margin-top: 10px;
}

.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  margin: 0;
  font-size: 24px;
}
</style> 