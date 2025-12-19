<template>
  <div>
    <el-row type="flex" justify="space-between" class="mb-20">
      <el-button type="primary" icon="el-icon-plus" @click="openAddDialog">添加影片</el-button>
    </el-row>

    <el-table :data="movies" v-loading="loading">
      <el-table-column prop="movieName" label="影片名称"></el-table-column>
      <el-table-column label="电影">
        <template slot-scope="scope">
          <el-tag
           v-if="scope.row.typeId"
            type="primary"
            class="mr-5"
          >
            {{ getTypeName(scope.row.typeId) }}
          </el-tag>
        </template>
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
            @click="deleteMovie(scope.row.movieId)"
            size="small"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑影片对话框 -->
    <el-dialog
      :title="isEditing ? '编辑影片' : '添加影片'"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      class="movie-dialog"
    >
      <el-form :model="movieForm" label-width="100px" class="movie-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="影片名称">
              <el-input v-model="movieForm.movieName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="导演">
              <el-input v-model="movieForm.director" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主演">
              <el-input v-model="movieForm.starring" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年份">
              <el-input v-model="movieForm.year" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="分类">
          <el-select
            v-model="movieForm.typeId"
            placeholder="请选择电影分类"
            style="width: 100%"
          >
            <el-option
              v-for="category in categories"
              :key="category.typeId"
              :label="category.typeName"
              :value="category.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            type="textarea"
            v-model="movieForm.remark"
            :rows="3"
            placeholder="请输入影片简介"
          />
        </el-form-item>
        <el-form-item label="封面">
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
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitMovie">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/utils/api';
export default {
  props: {
    categories: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      isEditing: false,
      movieForm: {
        movieName: '',
        typeId: [],
        director: '',
        starring: '',
        year: '',
        remark: '',
        imgUrl: ''
      },
      movies:[]
    }
  },
  methods: {
    openAddDialog() {
      this.isEditing = false;
      this.movieForm = {
        typeId: '',
        movieName: '',
        director: '',
        starring: '',
        year: '',
        remark: '',
        imgUrl: ''
      };
      this.dialogVisible = true;
    },
    setToken() {
      return {Authorization: 'Bearer ' + localStorage.getItem('token')|| ''}
    },
    openEditDialog(movie) {
      this.isEditing = true;
      this.movieForm = { ...movie };
      this.dialogVisible = true;
    },
    getTypeName(typeId) {
      const category = this.categories.find(c => c.typeId === typeId);
      return category ? category.typeName : '';
    },
    handleSuccess(response) {
      this.movieForm.imgUrl = response.result.path;
    },
    submitMovie() {
      if (this.isEditing) {
        // 编辑现有电影
        api.post('/movie/update', this.movieForm).then(() => {
          this.$message.success('电影更新成功');
          this.$emit('refresh-movies');
        }).catch(error => {
          console.error('更新电影失败:', error);
          this.$message.error('更新电影失败');
        });
      } else {
        // 添加新电影
        api.post('/movie/add', this.movieForm).then(() => {
          this.$message.success('电影添加成功');
          this.$emit('refresh-movies');
        }).catch(error => {
          this.$message.error('电影添加失败');
        });
      }
      this.dialogVisible = false;
    },
    deleteMovie(movieId) {
      this.$confirm('确认删除该电影吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
       api.post(`/movie/delete`, { movieId }).then(() => {
          this.$message.success('删除成功');
          this.$emit('refresh-movies');
        }).catch(error => {
          this.$message.error('删除电影失败');
        });
      }).catch(() => {
      });
    },
    handleExceed(files, fileList) {
      this.$message.warning('只能上传一个文件');
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt500K = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error('只能上传 JPG/PNG 格式的图片！');
        return false;
      }
      if (!isLt500K) {
        this.$message.error('图片大小不能超过 2MB！');
        return false;
      }
      return true;
    }
  }
}
</script>

<style scoped lang="scss">
.mb-20 {
  margin-bottom: 20px;
}

.mr-5 {
  margin-right: 5px;
}

.movie-dialog {
  .el-dialog__body {
    padding: 20px 30px;
  }
}

.movie-form {
  .el-form-item {
    margin-bottom: 22px;
  }
  
  .el-upload {
    width: 100%;
  }
  
  .el-upload-dragger {
    width: 100%;
  }
}

.upload-demo {
  .el-upload-dragger {
    width: 100%;
    height: 180px;
  }
  
  .el-upload__tip {
    line-height: 1.2;
    padding-top: 8px;
  }
}
</style> 