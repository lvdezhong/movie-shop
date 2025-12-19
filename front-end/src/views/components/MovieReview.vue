<template>
  <div>
    <el-row type="flex" justify="space-between" class="mb-20">
      <el-input
        placeholder="搜索评论内容"
        v-model="commentsContent"
        style="width: 300px"
        clearable
        @clear="handleSearch"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
    </el-row>

    <el-table :data="reviews" v-loading="loading">
      <el-table-column prop="commentsId" label="ID" width="80"></el-table-column>
      <el-table-column prop="movieName" label="电影名称" width="180"></el-table-column>
      <el-table-column prop="userName" label="用户名" width="120"></el-table-column>
      <el-table-column prop="commentsContent" label="评论内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="commentsTime" label="评论时间" width="180"></el-table-column>
      <el-table-column prop="state" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.state)">
            {{ scope.row.stateText }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            @click="approveReview(scope.row)"
            size="small"
            v-if="scope.row.state === '1'"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-close"
            circle
            @click="rejectReview(scope.row)"
            size="small"
            v-if="scope.row.state === '1'"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="deleteReview(scope.row.commentsId)"
            size="small"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑评论对话框 -->
    <el-dialog
      title="编辑评论"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      class="review-dialog"
    >
      <el-form :model="reviewForm" label-width="80px" class="review-form">
        <el-form-item label="电影名称">
          <el-input v-model="reviewForm.movieTitle" disabled />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="reviewForm.userName" disabled />
        </el-form-item>
        <el-form-item label="评分">
          <el-rate
            v-model="reviewForm.rating"
            show-score
            text-color="#ff9900"
          ></el-rate>
        </el-form-item>
        <el-form-item label="评论内容">
          <el-input
            type="textarea"
            v-model="reviewForm.content"
            :rows="4"
            placeholder="请输入评论内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitReview">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/utils/api';
export default {
  name: 'MovieReview',
  data() {
    return {
      loading: false,
      dialogVisible: false,
      commentsContent: '',
      reviewForm: {
        id: null,
        movieTitle: '',
        userName: '',
        content: '',
        rating: 0,
        createTime: '',
        status: ''
      },
      reviews: []
    }
  },
  mounted() {
    this.fetchComments()
  },
  computed: {},
  methods: {
    async fetchComments(data) {
      try {
        const response = await api.get('/movie_comments/listAll?commentsContent=' + this.commentsContent)
        if(response.code === 200){
          this.reviews = response.result
        }
        // this.comments = response
      } catch (error) {
        this.$message.error('获取评论失败')
      }
    },
    handleSearch() {
      // 搜索功能已通过计算属性实现
      this.fetchComments({commentsContent: this.commentsContent})
    },
    openEditDialog(review) {
      this.reviewForm = { ...review };
      this.dialogVisible = true;
    },
    submitReview() {
      const index = this.reviews.findIndex(r => r.id === this.reviewForm.id);
      if (index !== -1) {
        this.reviews[index] = { ...this.reviewForm };
        this.$message.success('评论更新成功');
      }
      this.dialogVisible = false;
    },
    deleteReview(id) {
      this.$confirm('确认删除该评论吗？删除后无法恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const response = await api.post('/movie_comments/delete', {
          commentsId: id
        })
        if (response.code === 200) {
          this.$message.success('成功')
          
          this.fetchComments()
        } else {
          this.$message.error('失败')
        }
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    getStatusType(status) {
      switch (status) {
        case '2':
          return 'success';
        case '1':
          return 'warning';
        case '3':
          return 'danger';
        default:
          return 'info';
      }
    },
    approveReview(review) {
      this.$confirm('确认通过该评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(async() => {
        this.updateState(review.commentsId, 2)
      }).catch(() => {
        this.$message.info('已取消操作');
      });
    },
    rejectReview(review) {
      this.$confirm('确认拒绝该评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.updateState(review.commentsId, 3)
      }).catch(() => {
        this.$message.info('已取消操作');
      });
    },
    async updateState(id, state) {
      const response = await api.post('/movie_comments/updateState', {
          commentsId: id,
          state: state
        })
        if (response.code === 200) {
          this.$message.success('成功')
          
          this.fetchComments()
        } else {
          this.$message.error('失败')
        }
    }
  }
}
</script>

<style scoped>
.mb-20 {
  margin-bottom: 20px;
}

.review-dialog {
  .el-dialog__body {
    padding: 20px 30px;
  }
}

.review-form {
  .el-form-item {
    margin-bottom: 22px;
  }
}

.el-rate {
  margin-top: 8px;
}
</style> 