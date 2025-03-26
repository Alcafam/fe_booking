import React, { useState } from 'react';
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
  const [errors, setErrors] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUserTypeChange = (type) => {
    setFormData((prevState) => ({
      ...prevState,

      user_type: type,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData, {
        withCredentials: true
      });
      const data = await response.data;
      setMessage(data.message);
      setSuccess(false);
      
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

      if (!data.success) {
        setErrors(data.errors);
      } else {
        localStorage.setItem('auth_token', data.token);
        login(data.user);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
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
          {/* {!success && message ? <span className="text-danger">{message}</span> : null} */}
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
              
{/* User Type */}
              <div className="form-group">
                <label>User Type</label>
                <div>
                  <button
                    type="button"
                    onClick={() => handleUserTypeChange('admin')}
                    className={formData.user_type === 'admin' ? 'bg-primary text-white' : ''}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUserTypeChange('user')}
                    className={formData.user_type === 'user' ? 'bg-primary text-white' : ''}
                  >
                    User
                  </button>
                </div>
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
