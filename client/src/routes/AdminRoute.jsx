import { Navigate } from 'react-router'

import useRole from '../hooks/useRole'

const AdminRoute = ({ children }) => {
  const {role, isRoleLoading} = useRole()

  if (isRoleLoading) return <p>Loading......</p>
  if (role === 'admin') return children
  return <Navigate to='/' replace='true' />
}

export default AdminRoute
