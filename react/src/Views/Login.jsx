import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Typography, Box } from '@mui/material'

function Login({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!username || !password) {
      alert("Por favor llena todos los campos")
      return
    }

    const success = onLogin({ username, password })
    if (success) {
      navigate("/admin")
    } else {
      alert("Usuario o contraseña incorrectos")
    }
  }

  return (
    <Box className="container">
      <Typography variant="h4" gutterBottom>Iniciar Sesion</Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2} width={300}>
          <TextField
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Contrasena"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" type="submit">
            Entrar
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default Login