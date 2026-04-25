import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function NavBar({ onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate("/")
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Mi App
        </Typography>
        <Box display="flex" gap={1}>
          <Button color="inherit" onClick={() => navigate("/profile")}>Perfil</Button>
          <Button color="inherit" onClick={() => navigate("/admin")}>Admin</Button>
          <Button color="inherit" onClick={handleLogout}>Salir</Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar