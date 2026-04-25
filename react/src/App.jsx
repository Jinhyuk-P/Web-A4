import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './Views/Login'
import Profile from './Views/Profile'
import Admin from './Views/Admin'
import NavBar from './components/NavBar'
import { useState, useEffect } from 'react'

const API = "http://localhost:5000"

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState({})
  const [userList, setUserList] = useState([])

  useEffect(() => {
    if (loggedIn) {
      fetchUsers()
    }
  }, [loggedIn])

  const fetchUsers = async () => {
    const response = await fetch(API + "/users")
    const data = await response.json()
    setUserList(data)
  }

  const handleLogin = (credentials) => {
    // login local, el backend no tiene endpoint de login
    if (credentials.username === "admin" && credentials.password === "admin") {
      setLoggedIn(true)
      setCurrentUser({ name: credentials.username })
      return true
    }
    return false
  }

  const handleLogout = () => {
    setLoggedIn(false)
    setCurrentUser({})
  }

  const handleAddUser = async (newUser) => {
    const response = await fetch(API + "/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newUser)
    })
    const data = await response.json()
    setUserList([...userList, data])
  }

  const handleDeleteUser = async (id) => {
    setUserList(userList.filter(u => u._id !== id))
    await fetch(API + "/users/" + id, {
      method: "DELETE"
    })
  }

  return (
    <BrowserRouter>
      {loggedIn && <NavBar onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/profile" element={<Profile user={currentUser} />} />
        <Route path="/admin" element={<Admin users={userList} onAdd={handleAddUser} onDelete={handleDeleteUser} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App