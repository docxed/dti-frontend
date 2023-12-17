export default ({ store }, inject) => {
  inject('loader', {
    show(data) {
      store.commit('loader/set', { visible: true, ...data })
    },
    hide() {
      store.commit('loader/set', { visible: false })
    },
  })
}
