<template>
  <el-container>
    <el-main>
      <el-card>
        <div slot="header" class="clearfix">
          <h1>我的订单</h1>
          <el-button
            type="primary"
            icon="el-icon-refresh"
            @click="refreshOrders"
          >
            刷新订单
          </el-button>
        </div>

        <el-table :data="orders" empty-text="暂无订单" style="width: 100%">
          <el-table-column prop="orderNo" label="订单号" width="300">
          </el-table-column>
          <el-table-column prop="orderTime" label="日期" width="300">
          </el-table-column>
          <el-table-column label="商品信息" min-width="300">
            <template slot-scope="scope">
              <div
                v-for="(item, index) in scope.row.items"
                :key="index"
                class="order-item"
              >
                <span>{{ item.productName }}</span>
                <span class="item-quantity">x{{ item.total }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="total" label="总金额" width="200">
            <template slot-scope="scope"> ¥{{ scope.row.total }} </template>
          </el-table-column>
          <el-table-column prop="stateText" label="状态" width="200" />
          <el-table-column
            v-if="user && user.status == '1'"
            prop="userName"
            label="用户名"
            width="200"
          />

          <!-- <el-table-column label="支付期限" width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.stateText === '待处理'">
                <span v-if="scope.row.paymentDeadline">
                  剩余时间: {{ formatTimeRemaining(scope.row.paymentDeadline) }}
                </span>
              </div>
              <span v-else>已支付</span>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-view"
                circle
                @click="viewOrder(scope.row)"
                size="small"
              ></el-button>
              <el-button
                type="success"
                icon="el-icon-wallet"
                circle
                @click="goToPay(scope.row)"
                size="small"
                v-if="scope.row.stateText === '待处理'"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="cancelOrder(scope.row)"
                size="small"
                v-if="scope.row.stateText === '待处理'"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-main>

    <!-- 支付对话框 -->
    <PaymentDialog
      v-if="currentOrder"
      :visible="paymentVisible"
      :order="currentOrder"
      @close="paymentVisible = false"
      @success="handlePaymentSuccess"
    />

    <!-- 订单详情对话框 -->
    <el-dialog
      title="订单详情"
      :visible.sync="orderDetailVisible"
      width="600px"
      :before-close="handleOrderDetailClose"
    >
      <el-card v-if="currentOrder" class="order-detail-card">
        <div slot="header" class="clearfix">
          <h3 class="order-detail-title">订单信息</h3>
        </div>
        <div class="order-detail-info">
          <p><strong>订单号：</strong>{{ currentOrder.orderNo }}</p>
          <p><strong>日期：</strong>{{ formatDate(currentOrder.orderTime) }}</p>
          <p><strong>总金额：</strong>¥{{ currentOrder.total }}</p>
          <p><strong>总数量：</strong>{{ currentOrder.total }}</p>
          <p>
            <strong>状态：</strong>
            <el-tag :type="getStatusType(currentOrder.orderState)">
              {{ currentOrder.stateText }}
            </el-tag>
          </p>
          <!-- <p><strong>支付期限：</strong>{{ formatDate(currentOrder.paymentDeadline) }}</p> -->
        </div>
        <div class="order-items">
          <h4 class="order-items-title">商品信息</h4>
          <el-table :data="currentOrder.items" style="width: 100%">
            <el-table-column
              prop="productName"
              label="商品名称"
            ></el-table-column>
            <el-table-column prop="outPrice" label="单价">
              <template slot-scope="scope">
                ¥{{ scope.row.outPrice }}
              </template>
            </el-table-column>
            <el-table-column prop="productNum" label="数量"></el-table-column>
            <el-table-column label="小计">
              <template slot-scope="scope"> ¥{{ scope.row.total }} </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleOrderDetailClose">关闭</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import api from '@/utils/api'

import dayjs from 'dayjs'
import PaymentDialog from '@/components/Payment.vue'

export default {
  name: 'Orders',
  components: {
    PaymentDialog,
  },
  data() {
    return {
      loading: false,
      orders: [],
      paymentVisible: false,
      currentOrder: null,
      orderDetailVisible: false,
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      user: (state) => state.user,
      favorites: (state) => state.favorites,
    }),
  },
  mounted() {
    this.fetchOrders()
  },

  methods: {
    async fetchOrders() {
      // 模拟API调用延迟
      this.loading = true
      let response = await api.get('/order/list?userId=' + this.user.userId)
      if (response.code === 200) {
        this.orders = response.result
      } else {
        this.$message.error(response.reason)
      }
      this.loading = false
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    getStatusType(orderState) {
      switch (orderState) {
        case '2':
          return 'success'
        case '1':
          return 'warning'
        case '3':
          return 'danger'
        default:
          return 'info'
      }
    },
    viewOrder(order) {
      this.currentOrder = order
      this.orderDetailVisible = true
    },
    goToPay(order) {
      this.$confirm(`确认支付订单 ${order.orderNo} 吗？`, '提示', {
        confirmButtonText: '去支付',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // 设置当前订单并打开支付对话框
        this.currentOrder = order
        this.paymentVisible = true
      })
    },
    // 处理支付完成
    handlePaymentSuccess() {
      const index = this.orders.findIndex(
        (o) => o.orderId === this.currentOrder.orderId
      )
      if (index !== -1) {
        this.orders[index].stateText = '已完成'
        this.fetchOrders()
        // this.$message.success('支付成功！');
      }
      this.paymentVisible = false
    },
    cancelOrder(order) {
      this.$confirm('确认取消该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          api
            .post('/order/delete', { orderId: order.orderId })
            .then((response) => {
              this.$message.success('取消成功')
              this.fetchOrders()
            })
        })
        .catch(() => {})
    },
    refreshOrders() {
      this.fetchOrders()
      this.$message.success('订单列表已刷新')
    },
    formatTimeRemaining(deadline) {
      const now = new Date()
      const timeDiff = new Date(deadline) - now

      if (timeDiff <= 0) {
        return '已过期'
      }

      const hours = Math.floor(timeDiff / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

      return `${hours}小时 ${minutes}分钟 ${seconds}秒`
    },
    startCountdown() {
      setInterval(() => {
        this.orders.forEach((order) => {
          if (order.stateText === '待处理' && order.paymentDeadline) {
            const now = new Date()
            if (new Date(order.paymentDeadline) <= now) {
              order.stateText = '已取消'
            }
          }
        })
      }, 1000)
    },
    handleOrderDetailClose() {
      this.orderDetailVisible = false
    },
  },
  created() {
    // if (!this.isLoggedIn) {
    //   this.$router.push('/login')
    //   return
    // }
    this.fetchOrders()
    this.startCountdown()
  },
}
</script>

<style scoped>
.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  margin: 0;
  font-size: 24px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.order-item:last-child {
  margin-bottom: 0;
}

.item-quantity {
  color: #909399;
  margin-left: 8px;
}

/* 添加倒计时样式 */
.countdown {
  color: #e6a23c;
  font-weight: bold;
}

.order-detail-card {
  border: none;
  box-shadow: none;
}

.order-detail-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.order-detail-info {
  margin-bottom: 20px;
}

.order-detail-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #606266;
}

.order-items-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 16px;
}

.dialog-footer {
  text-align: right;
  margin-top: 20px;
}
</style>
