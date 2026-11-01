import api from "@/api/client"

const CSRF_URL = "accounts/csrf/"
const LOGIN_URL = "accounts/login/"
const LOGOUT_URL = "accounts/logout/"
const REGISTER_URL = "accounts/register/"

export async function loginUser(username: string, password: string) {
  await api.get(CSRF_URL)
  const loginData = { username, password }
  const response = await api.post(LOGIN_URL, loginData)
  return response.data
}

export async function logoutUser() {
  const response = await api.post(LOGOUT_URL)
  return response.data
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
) {
  await api.get(CSRF_URL)
  const registerData = { username, email, password }
  const response = await api.post(REGISTER_URL, registerData)
  return response.data
}
