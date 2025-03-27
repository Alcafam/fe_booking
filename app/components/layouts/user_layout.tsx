import { Outlet } from "react-router";
import { useAuth } from '../AuthContext';
import axios from 'axios'
import { Navigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function ProjectLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.get(`${API_URL}/api/auth/logout`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      logout();
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <div className="header_section mt-1 pt-4 pb-3 mb-5">
        <div className="container-fluid">
            <nav className="navbar navbar-light bg-light justify-content-start border border-0">
                <div className="form-inline position-absolute end-0 px-5">
                    <ul className="list-unstyled">
                        <li className="d-inline px-2"><span className="fs-3">Hi {user?.first_name} {user?.last_name}!</span></li>
                        <li className="d-inline px-2"><button type="button" onClick={handleSubmit}>Logout</button></li>
                    </ul>
                </div>
            </nav>
        </div>
      </div>
      <Outlet />
    </div>
  );
}