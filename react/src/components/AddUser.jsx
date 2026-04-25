import { useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'

function AddUser({ onAdd }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name || !email) {
      alert("Todos los campos son obligatorios")
      return
    }
    onAdd({ name, email })
    setName("")
    setEmail("")
  }

  return (
    <Box component="form" onSubmit={handleAdd} mb={3}>
      <Typography variant="h6" gutterBottom>Agregar Usuario</Typography>
      <Box display="flex" gap={2} flexWrap="wrap">
        <TextField
          label="Nombre"
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          size="small"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="contained" color="success" type="submit">
          Agregar
        </Button>
      </Box>
    </Box>
  )
}

export default AddUser