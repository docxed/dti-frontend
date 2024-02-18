export default ({ $auth, route, redirect }) => {
  const adminPages = ['/admin', '/examset', '/report', '/user', '/review']
  const studentPages = ['/exam']
  const teacherPages = ['/evaluate']
  if (adminPages.some((page) => route.path.startsWith(page))) {
    if (!$auth.user.groups.includes('แอดมิน')) {
      return redirect('/home')
    }
  } else if (studentPages.some((page) => route.path.startsWith(page))) {
    if (!$auth.user.groups.includes('นักเรียน')) {
      return redirect('/home')
    }
  }
  if (teacherPages.some((page) => route.path.startsWith(page))) {
    if (!$auth.user.groups.includes('ครู')) {
      return redirect('/home')
    }
  }
}
