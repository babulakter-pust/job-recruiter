import { useState } from 'react'
import { login } from '../lib/auth'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (login(username, password)) {
      setError('')
      onLogin()
    } else {
      setError('Invalid username or password.')
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Job Application Tracker</h1>
        <p className="app-subtitle">Sign in to view your applications.</p>

        <label>
          Username
          <input
            className="input"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label>
          Password
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="btn btn-primary">
          Log In
        </button>
      </form>
    </div>
  )
}
