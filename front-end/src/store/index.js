import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/utils/api'
import router from '@/router'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    cart: [],
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    movies: [],
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    user: JSON.parse(localStorage.getItem('user') || '{}'),
    orders: []
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    user: state => state.user,
    cartItems: state => state.cart,
    cartTotal: state => state.cart.reduce((total, item) => total + (item.price * item.quantity), 0),
    cartItemCount: state => state.cart.reduce((total, item) => total + item.quantity, 0),
    favoritesList: state => state.favorites
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    setCurrentUser(state, user) {
      state.currentUser = user
      localStorage.setItem('currentUser', JSON.stringify(user))
    },
    clearAuth(state) {
      state.token = ''
      state.currentUser = null
      localStorage.removeItem('token')
      localStorage.removeItem('currentUser')
    },
    setFavorites(state, favorites) {
      state.favorites = favorites
    },
    addToFavorites(state, movie) {
      state.favorites.push(movie)
    },
    removeFromFavorites(state, movieId) {
      state.favorites = state.favorites.filter(movie => movie.id !== movieId)
    },
    ADD_TO_CART(state, item) {
      const existingItem = state.cart.find(i => i.id === item.id)
      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        state.cart.push(item)
      }
    },
    REMOVE_FROM_CART(state, id) {
      state.cart = state.cart.filter(item => item.id !== id)
    },
    UPDATE_CART_ITEM(state, { id, quantity }) {
      const item = state.cart.find(i => i.id === id)
      if (item) {
        item.quantity = quantity
      }
    },
    clearCart(state) {
      state.cart = []
      localStorage.removeItem('cart')
    },
    toggleFavorite(state, movie) {
      const index = state.favorites.findIndex(f => f.id === movie.id)
      if (index === -1) {
        state.favorites.push(movie)
      } else {
        state.favorites.splice(index, 1)
      }
      localStorage.setItem('favorites', JSON.stringify(state.favorites))
    },
    updateMovieRating(state, movie) {
      const index = state.movies.findIndex(m => m.id === movie.id)
      if (index !== -1) {
        state.movies[index] = { ...state.movies[index], ...movie }
      }
    },
    setLoggedIn(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
      localStorage.setItem('isLoggedIn', isLoggedIn);
    },
    setUser(state, user) {
      state.user = user || {};
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = {};
      state.token = '';
      state.currentUser = null;
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('favorites');
      localStorage.removeItem('cart');
    },
    ADD_ORDER(state, order) {
      state.orders.push(order);
    }
  },
  actions: {
    logout({ commit }) {
      commit('logout')
    },
    addToCart({ commit }, item) {
      commit('ADD_TO_CART', item)
    },
    removeFromCart({ commit }, id) {
      commit('REMOVE_FROM_CART', id)
    },
    updateCartItem({ commit }, payload) {
      commit('UPDATE_CART_ITEM', payload)
    },
    updateLoginState({ commit }, { token, user }) {
      commit('setLoggedIn', true);
      commit('setUser', user);
      localStorage.setItem('token', token);
    },
    async updateProfile({ commit }, profileData) {
      try {
        const response = await api.put('/user/profile', profileData)
        commit('setCurrentUser', response.data.user)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async changePassword(_, passwordData) {
      try {
        const response = await api.put('/user/password', passwordData)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async createOrder({ commit }, orderData) {
      try {
        const response = await api.post('/orders', orderData)
        commit('clearCart')
        return response.data
      } catch (error) {
        throw error
      }
    },
    async getOrders() {
      try {
        const response = await api.get('/orders')
        return response.data
      } catch (error) {
        throw error
      }
    },
    async payOrder(_, orderId) {
      try {
        const response = await api.post(`/orders/${orderId}/pay`)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async confirmReceive(_, orderId) {
      try {
        const response = await api.post(`/orders/${orderId}/receive`)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async cancelOrder(_, orderId) {
      try {
        const response = await api.post(`/orders/${orderId}/cancel`)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async deleteOrder(_, orderId) {
      try {
        const response = await api.delete(`/orders/${orderId}`)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async getComments(_, movieId) {
      try {
        const response = await api.get(`/movies/${movieId}/comments`)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async addComment(_, { content, movieId }) {
      try {
        const response = await api.post(`/movies/${movieId}/comments`, { content })
        return response.data
      } catch (error) {
        throw error
      }
    },
    async deleteComment(_, commentId) {
      try {
        const response = await api.delete(`/comments/${commentId}`)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async rateMovie({ commit }, { movieId, rating }) {
      try {
        const response = await api.post(`/movies/${movieId}/rate`, { rating })
        commit('updateMovieRating', response.data)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async getFavorites() {
      try {
        const response = await api.get('/favorites')
        return response.data
      } catch (error) {
        throw error
      }
    },
    async toggleFavorite({ commit, state }, movie) {
      try {
        const response = await api.post(`/favorites/${movie.id}/toggle`)
        commit('toggleFavorite', movie)
        return response.data
      } catch (error) {
        throw error
      }
    },
    addOrder({ commit }, order) {
      commit('ADD_ORDER', order);
    }
  }
})

export default store 