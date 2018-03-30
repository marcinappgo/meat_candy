export const loginUser = (user, token, PHPSESSID) => ({
  type: 'AUTH_LOGIN',
  user,
  token,
  PHPSESSID
})

export const logoutUser = () => ({
  type: 'AUTH_LOGOUT'
})
