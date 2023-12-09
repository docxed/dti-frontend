export default ({ $auth, route, redirect }) => {
  const adminPages = ['/admin', '/examset']
  if (adminPages.some((page) => route.path.startsWith(page))) {
    if (!$auth.user.groups.includes('แอดมิน')) {
      return redirect('/home')
    }
  }
}
