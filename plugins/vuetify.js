export default (context) => {
  if (process.client) {
    const themeColor = localStorage.getItem('theme-primary-color')
    if (themeColor) {
      context.$vuetify.theme.themes.light.primary = themeColor
      context.$vuetify.theme.themes.dark.primary = themeColor
    }
  }
}
