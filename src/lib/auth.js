const AUTH_KEY = 'job-recruiter-auth-v1'

// NOTE: this is a client-side-only gate for a static site with no
// backend. The credentials below ship inside the JS bundle and are
// readable by anyone who opens dev tools - it keeps casual visitors
// out, it is not real security.
const CREDENTIALS = {
  username: 'babul-pust',
  password: '34052310abc',
}

export function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === 'true'
}

export function login(username, password) {
  const ok =
    username.trim() === CREDENTIALS.username && password === CREDENTIALS.password
  if (ok) localStorage.setItem(AUTH_KEY, 'true')
  return ok
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}
