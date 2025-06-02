import { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router";
import type { Route } from "./+types/login";
import { useAuth } from '../AuthContext';
import { Navigate  } from 'react-router-dom';
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL;

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    user_type: 'user', // Default to 'user'
  });

  const { isAuthenticated,login, loading } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const showSwal = async (data: any) => {
    const alertClass = data.success ? "text-success" : "text-danger";
    Swal.fire({
      title: data.message,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      customClass: {
        title: alertClass,
      },
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData, {
        headers: {
          accept: "application/json",
        },
      });
  
      console.log(response);
      const data = response.data;
      showSwal(data);

      localStorage.setItem('auth_token', data.token);
      login(data.user);
    } catch (error: any) {
      console.error('An unexpected error occurred:', error);
      console.log(error.response.data)
  
      const errorData = error.response ? error.response.data : { message: 'An unexpected error occurred', success: false };
      setErrors(errorData.errors);
      showSwal(errorData);
    }
  };
  

  if (loading) {
    return <div>Loading...</div>; // Render a loading state while checking localStorage
  }

  if (isAuthenticated) {
    return <Navigate to='/dashboard' />;
  }

  return (
    <div className="product_section layout_padding">
      <div className="container w-25">
        <div className="login-container text-center">
          <h3 className="fs-2">Login Form</h3>
          <div className="container-content">
            <form className="mt-3" onSubmit={handleSubmit}>
{/* Email Address */}
            <div className="form-group">
              <input
                className="form-control mb-2"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
              />
              {errors?.email ? <span className="text-danger">{errors.email[0]}</span> : null}
            </div>
              
{/* Password */}
            <div className="form-group">
              <input
                className="form-control mb-2"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              {errors?.password ? <span className="text-danger">{errors.password[0]}</span> : null}
          </div>

              <input
                type="submit"
                className="btn btn-pink w-100 my-3"
                value="Login"
              />
              <p className="fs-5 text-centerenter">Do not have an account?</p>
              <Link to="/register" className="fs-5">Register</Link>
            </form>
          </div>
        </div>
        <div className="bg-warning container mt-5 p-3 rounded">
          <b>Note:</b>
          <p>For testing purposes, you can use the following accounts:</p>
          <ul className="mt-2">
            <li>
              <b>Admin Account</b>
              <p>Email: <code>alice.johnson@example.com</code></p>
              <p>Password: <code>password</code></p>
            </li>
            <li className="mt-2">
              <b>User Account 1</b>
              <p>Email: <code>james.williams@example.com</code></p>
              <p>Password: <code>password</code></p>              
            </li>
            <li className="mt-2">
              <b>User Account 2</b>
              <p>Email: <code>sarah.miller@example.com</code></p>
              <p>Password: <code>password</code></p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - Event Booking" },
  ];
}
