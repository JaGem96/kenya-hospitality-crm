import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Check if user is logged in (we saved this in localStorage during login)
  const userInfo = localStorage.getItem('userInfo');

  // If no user info, kick them back to login
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, show the page
  return children;
}

export default ProtectedRoute;