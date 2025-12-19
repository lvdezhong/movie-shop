<template>
  <div>
    <el-row type="flex" justify="space-between" class="mb-20">
      <el-button type="primary" icon="el-icon-plus" @click="openAddDialog">添加分类</el-button>
    </el-row>

    <el-table :data="categories" v-loading="loading">
      <el-table-column prop="typeId" label="ID" width="80"></el-table-column>
      <el-table-column prop="typeName" label="分类名称"></el-table-column>
      <el-table-column prop="typeRemark" label="描述"></el-table-column>
      <el-table-column prop="movieCount" label="电影数量" width="100"></el-table-column>
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
            @click="deleteCategory(scope.row.typeId)"
            size="small"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog
      :title="isEditing ? '编辑分类' : '添加分类'"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
      class="category-dialog"
    >
      <el-form :model="categoryForm" label-width="80px" class="category-form">
        <el-form-item label="分类名称">
          <el-input v-model="categoryForm.typeName" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            v-model="categoryForm.typeRemark"
            :rows="3"
            placeholder="请输入分类描述"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/utils/api';

export default {
  typeName: 'CategoryManagement',
  props: {
    categories: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      isEditing: false,
      categoryForm: {
        typeId: null,
        typeName: '',
        typeRemark: '',
        movieCount: 0
      }
    }
  },
  methods: {
    openAddDialog() {
      this.isEditing = false;
      this.categoryForm = {
        typeId: null,
        typeName: '',
        typeRemark: '',
        movieCount: 0
      };
      this.dialogVisible = true;
    },
    openEditDialog(category) {
      this.isEditing = true;
      this.categoryForm = { ...category };
      this.dialogVisible = true;
    },
    submitCategory() {
      if (this.isEditing) {
        // 编辑现有分类
        api.post(`/type/update`, this.categoryForm).then(() => {
          this.$message.success('分类更新成功');
          this.$emit('refresh-categories');
        }).catch(error => {
          console.error('更新分类失败:', error);
          this.$message.error('更新分类失败');
        });
      } else {
        // 添加新分类
        api.post('/type/add', this.categoryForm).then(() => {
          this.$message.success('分类添加成功');
          this.$emit('refresh-categories');
        }).catch(error => {
          console.error('添加分类失败:', error);
          this.$message.error('添加分类失败');
        });
      }
      this.dialogVisible = false;
    },
    deleteCategory(typeId) {
      this.$confirm('确认删除该分类吗？删除后无法恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.post(`/type/delete`, { typeId }).then(() => {
          this.$message.success('删除成功');
          this.$emit('refresh-categories');
        }).catch(error => {
          console.error('删除分类失败:', error);
          this.$message.error('删除分类失败');
        });
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    }
  }
}
</script>

<style scoped lang="scss">
.mb-20 {
  margin-bottom: 20px;
}

.category-dialog {
  .el-dialog__body {
    padding: 20px 30px;
  }
}

.category-form {
  .el-form-item {
    margin-bottom: 22px;
  }
}
</style> 