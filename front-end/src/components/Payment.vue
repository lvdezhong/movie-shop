<template>
  <div class="payment-dialog">
    <el-dialog
      title="支付订单"
      :visible.sync="visible"
      width="400px"
      :before-close="handleClose"
      custom-class="payment-dialog-custom"
    >
      <el-card class="payment-card">
        <div slot="header" class="clearfix">
          <h3 class="order-title">订单信息</h3>
        </div>
        <div class="order-info">
          <p><strong>订单号：</strong>{{ order.orderNo }}</p>
          <p><strong>总金额：</strong>¥{{ order.total }}</p>
          <p>
            <strong>支付期限：</strong>{{ formatDate(order.paymentDeadline) }}
          </p>
        </div>
        <div class="payment-methods">
          <h4 class="payment-title">选择支付方式</h4>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card class="payment-method-card" shadow="hover">
                <img
                  src="@/assets/images/alipay.png"
                  alt="支付宝二维码"
                  class="qr-code"
                />
                <p class="payment-method-name">支付宝</p>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="payment-method-card" shadow="hover">
                <img
                  src="@/assets/images/wx.png"
                  alt="微信二维码"
                  class="qr-code"
                />
                <p class="payment-method-name">微信支付</p>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose" class="cancel-btn">取消</el-button>
        <el-button
          type="primary"
          @click="handlePaymentSuccess"
          class="confirm-btn"
          >确认支付完成</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import api from '@/utils/api'
export default {
  name: 'Payment',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    order: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handlePaymentSuccess() {
      api
        .post('/order/update', { orderId: this.order.orderId, state: 2 })
        .then(() => {
          this.$message.success('支付成功')
        })
        .catch((error) => {
          this.$message.error('支付失败')
        })
      this.$emit('success')
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm')
    },
  },
}
</script>

<style scoped>
.payment-dialog-custom {
  border-radius: 8px;
}

.payment-card {
  border: none;
  box-shadow: none;
}

.order-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.order-info {
  margin-bottom: 20px;
}

.order-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #606266;
}

.payment-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 16px;
}

.payment-method-card {
  text-align: center;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.payment-method-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qr-code {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.payment-method-name {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.dialog-footer {
  text-align: right;
  margin-top: 20px;
}

.cancel-btn {
  background-color: #f5f5f5;
  border-color: #dcdfe6;
  color: #606266;
}

.confirm-btn {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}

.confirm-btn:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}
</style>
