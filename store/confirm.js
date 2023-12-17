export const state = () => ({
  showDialog: false,
  resolveCallback: null,
  rejectCallback: null,
  title: '',
  message: '',
})

export const mutations = {
  setDialog(state, value) {
    state.showDialog = value
  },
  setResolveCallback(state, callback) {
    state.resolveCallback = callback
  },
  setRejectCallback(state, callback) {
    state.rejectCallback = callback
  },
  setTitle(state, data) {
    state.title = data.title || 'ยืนยันการลบข้อมูล'
  },
  setMessage(state, data) {
    state.message = data.message || 'คุณต้องการลบข้อมูลใช่หรือไม่?'
  },
}

export const actions = {
  async showConfirmDialog({ commit, dispatch }, data) {
    commit('setDialog', true)
    commit('setResolveCallback', null)
    commit('setRejectCallback', null)
    commit('setTitle', { ...data })
    commit('setMessage', { ...data })

    return new Promise((resolve, reject) => {
      commit('setResolveCallback', resolve)
      commit('setRejectCallback', reject)
    })
  },
  async confirm({ state, commit }) {
    if (state.resolveCallback) {
      state.resolveCallback(true)
    }
    commit('setDialog', false)
  },
  async cancel({ state, commit }) {
    if (state.rejectCallback) {
      state.rejectCallback(false)
    }
    commit('setDialog', false)
  },
}
