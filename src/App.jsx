import { useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setUser(data.user)
      setError('')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="app-container">
      <h1>Hotel Concierge App</h1>

      {!user ? (
        <div className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      ) : (
        <div className="dashboard">
          <p>Welcome, {user.email}!</p>
          <h2>Available Concierge Services</h2>
          <ul>
            <li>Room Service</li>
            <li>Spa Booking</li>
            <li>Taxi Arrangement</li>
            <li>Tour Guide Request</li>
          </ul>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  )
}

export default App
