import api from '@/utils/api';

export default {
  data() {
    return {
      movies: [],
    };
  },
  async created() {
    try {
      const response = await api.get('/movies');
      this.movies = response;
    } catch (error) {
      console.error('获取影片列表失败', error.response.data);
    }
  },
}; 