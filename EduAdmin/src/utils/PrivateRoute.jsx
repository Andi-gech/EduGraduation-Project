import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
const PrivateRoute = ({ allowedRoles }) => {
 
  const auth = useAuthUser()
  
  const userRole =auth?.role;


  if (!allowedRoles.includes(userRole)) {

    return <Navigate to="/unauthorized" replace />;
  }


  return <Outlet />;
};

export default PrivateRoute;