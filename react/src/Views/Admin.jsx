import { Typography, Box } from '@mui/material'
import AddUser from '../components/AddUser'
import UserRow from '../components/UserRow'

function Admin({ users, onAdd, onDelete }) {
  return (
    <Box className="container">
      <Typography variant="h4" gutterBottom>Panel de Administrador</Typography>

      <AddUser onAdd={onAdd} />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <UserRow key={u._id} user={u} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </Box>
  )
}

export default Admin