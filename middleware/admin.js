export default ({ $auth, route, redirect }) => {
  // admin only
  if ($auth.user.groups.includes('แอดมิน')) {
    console.log('admin')
    return redirect('/')
  }
}
