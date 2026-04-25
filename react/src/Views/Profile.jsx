import { Typography, Box, Paper } from '@mui/material'

function Profile({ user }) {
  return (
    <Box className="container">
      <Paper elevation={3} style={{ padding: 30, width: 350 }}>
        <Typography variant="h5" gutterBottom>Mi Perfil</Typography>
        <Typography variant="body1"><strong>Nombre:</strong> {user.name}</Typography>
        <Typography variant="body1"><strong>ID:</strong> {user._id}</Typography>
      </Paper>
    </Box>
  )
}

export default Profile