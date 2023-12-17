export const state = () => ({
  visible: false,
  title: '',
  description: '',
})

export const mutations = {
  set(state, data) {
    state.visible = data.visible
    state.title = data.title || 'กำลังโหลด...'
    state.description = data.description || ''
  },
}

export const actions = {
  show({ commit }, data) {
    commit('set', { visible: true, ...data })
  },
  hide({ commit }) {
    commit('set', { visible: false })
  },
}
