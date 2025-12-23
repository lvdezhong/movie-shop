<template>
  <div>
    <el-row type="flex" justify="end" class="mb-20">
      <el-button type="primary" icon="el-icon-plus" @click="openAddDialog"
        >添加商品</el-button
      >
    </el-row>

    <el-table :data="products" v-loading="loading">
      <el-table-column prop="productId" label="ID" width="80"></el-table-column>
      <el-table-column prop="productName" label="产品名称"></el-table-column>
      <el-table-column prop="productUrl" label="产品图片">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.productUrl"
            :preview-src-list="[scope.row.productUrl]"
            style="width: 60px; height: 60px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="outPrice" label="价格">
        <template slot-scope="scope">¥ {{ scope.row.outPrice }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="openEditDialog(scope.row)"
            size="small"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="deleteProduct(scope.row.productId)"
            size="small"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑产品对话框 -->
    <el-dialog
      :title="isEditing ? '编辑产品' : '添加产品'"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
      class="product-dialog"
    >
      <el-form :model="productForm" label-width="80px" class="product-form">
        <el-form-item label="产品名称">
          <el-input
            v-model="productForm.productName"
            placeholder="请输入产品名称"
          />
        </el-form-item>
        <el-form-item label="产品图片">
          <el-upload
            class="upload-demo"
            drag
            action="http://localhost:3000/upload"
            :limit="1"
            :headers="setToken()"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过2MB
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="价格">
          <el-input
            v-model="productForm.outPrice"
            placeholder="请输入产品价格"
          />
        </el-form-item>
        <el-form-item label="关联电影">
          <el-select
            v-model="productForm.productName"
            placeholder="请输入产品名称"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            v-model="productForm.remark"
            :rows="3"
            placeholder="请输产品类描述"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitProduct">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/utils/api'

export default {
  typeName: 'ProductManagement',
  data() {
    return {
      loading: false,
      dialogVisible: false,
      isEditing: false,
      products: [],
      productForm: {
        productName: '',
        outPrice: '',
        productUrl: '',
        remark: '',
      },
    }
  },
  mounted() {
    this.getProducts()
  },
  methods: {
    setToken() {
      return { Authorization: 'Bearer ' + localStorage.getItem('token') || '' }
    },
    getProducts() {
      this.loading = true
      api
        .get('/product/list')
        .then((res) => {
          console.log('product', res)
          this.products = res.result
        })
        .catch((error) => {
          console.error('获取产品列表失败:', error)
          this.$message.error('获取产品列表失败')
        })
        .finally(() => {
          this.loading = false
        })
    },
    openAddDialog() {
      this.isEditing = false
      this.productForm = {
        productName: '',
        outPrice: '',
        productUrl: '',
        remark: '',
      }
      this.dialogVisible = true
    },
    openEditDialog(product) {
      this.isEditing = true
      this.productForm = { ...product }
      this.dialogVisible = true
    },
    submitProduct() {
      if (this.isEditing) {
        // 编辑现有产品
        api
          .post(`/product/update`, this.productForm)
          .then(() => {
            this.$message.success('产品更新成功')
          })
          .catch((error) => {
            console.error('更新产品失败:', error)
            this.$message.error('更新产品失败')
          })
      } else {
        // 添加新产品
        api
          .post('/product/add', this.productForm)
          .then(() => {
            this.$message.success('产品添加成功')
          })
          .catch((error) => {
            console.error('添加产品失败:', error)
            this.$message.error('添加产品失败')
          })
      }
      this.dialogVisible = false
    },
    deleteProduct(productId) {
      this.$confirm('确认删除该产品吗？删除后无法恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          api
            .post(`/product/delete`, { productId })
            .then(() => {
              this.$message.success('删除成功')
            })
            .catch((error) => {
              console.error('删除产品失败:', error)
              this.$message.error('删除产品失败')
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    handleExceed(files, fileList) {
      this.$message.warning('只能上传一个文件')
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt500K = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('只能上传 JPG/PNG 格式的图片！')
        return false
      }
      if (!isLt500K) {
        this.$message.error('图片大小不能超过 2MB！')
        return false
      }
      return true
    },
    handleSuccess(response) {
      this.productForm.productUrl = response.result.path
    },
  },
}
</script>

<style scoped lang="scss">
.mb-20 {
  margin-bottom: 20px;
}

.product-dialog {
  .el-dialog__body {
    padding: 20px 30px;
  }
}

.product-form {
  .el-form-item {
    margin-bottom: 22px;
  }
}
</style>
