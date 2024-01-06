export default ({ $auth, route, redirect }) => {
  // admin only
  if ($auth.user.groups.includes('แอดมิน')) {
    return redirect('/')
  }
}
