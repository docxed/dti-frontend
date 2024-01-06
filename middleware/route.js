export default ({ $auth, route, redirect }) => {
  const adminPages = ['/admin', '/examset']
  const studentPages = ['/exam']
  if (adminPages.some((page) => route.path.startsWith(page))) {
    if (!$auth.user.groups.includes('แอดมิน')) {
      return redirect('/home')
    }
  } else if (studentPages.some((page) => route.path.startsWith(page))) {
    if (!$auth.user.groups.includes('นักเรียน')) {
      return redirect('/home')
    }
  }
}
