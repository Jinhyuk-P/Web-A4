import { Button } from '@mui/material'

function UserRow({ user, onDelete }) {
  return (
    <tr>
      <td>{user._id}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => onDelete(user._id)}
        >
          Eliminar
        </Button>
      </td>
    </tr>
  )
}

export default UserRow