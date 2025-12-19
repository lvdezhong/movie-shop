const state = {
  cart: []
}

const mutations = {
  ADD_TO_CART(state, item) {
    const existingItem = state.cart.find(i => i.id === item.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      state.cart.push({ ...item, quantity: 1 })
    }
  },
  REMOVE_FROM_CART(state, item) {
    state.cart = state.cart.filter(i => i.id !== item.id)
  }
}

const actions = {
  addToCart({ commit }, item) {
    commit('ADD_TO_CART', item)
  },
  removeFromCart({ commit }, item) {
    commit('REMOVE_FROM_CART', item)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
} 