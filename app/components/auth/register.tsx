import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router";
import type { Route } from "./+types/register";
import { useAuth } from '../AuthContext';
import { Navigate } from 'react-router-dom';
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL;
const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    user_type: 'user', // Default to 'user'
  });

  const { isAuthenticated, login } = useAuth();
  const [errors, setErrors] = useState({});

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await setErrors({}); // Reset previous errors

    try {
      // Send the registration request to the Laravel API
      const response = await axios.post(`${API_URL}/api/auth/register`, formData);
      const data = await response.data;
      console.log(data);

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

      if(!data.success){
        await setErrors(data.errors);
      }else{
        localStorage.setItem('auth_token', data.token);
        login(data.user);
      }


    } catch (error) {
        console.error('An unexpected error occurred:', error);
    }
  };

  if (isAuthenticated) {
    return <Navigate to='/dashboard' />;
  }

    return (
        <div className="product_section layout_padding">
        <div className="container w-25">
            <div className="login-container text-center">
                <h3 className="fs-2">Registration Form</h3>
                <div className="container-content">
                    <form className="mt-3" onSubmit={handleSubmit}>
{/* First Name */}
                      <div className="form-group">
                        <input className="form-control mb-2"  
                          type="text"
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          placeholder="First Name"
                        />  
                        {errors.first_name && <span className="text-danger">{errors.first_name[0]}</span>}   
                      </div>
{/* Last Name */}
                      <div className="form-group">
                        <input className="form-control mb-2"  
                          type="text"
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          placeholder="Last Name"
                        />  
                        {errors.last_name && <span className="text-danger">{errors.last_name[0]}</span>}   
                      </div>
{/* Email */}
                      <div className="form-group">
                        <input className="form-control mb-2"  
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email Address"
                        />  
                        {errors.email && <span className="text-danger">{errors.email[0]}</span>}   
                      </div>
{/* Password */}
                      <div className="form-group">
                        <input className="form-control mb-2"  
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Password"
                        />  
                        {errors.password && <span className="text-danger">{errors.password[0]}</span>}   
                      </div>
{/* Password Confirmation */}
                      <div className="form-group">
                        <input className="form-control mb-2"  
                          type="password"
                          id="password_confirmation"
                          name="password_confirmation"
                          value={formData.password_confirmation}
                          onChange={handleChange}
                          placeholder="Condirm Password"
                        />  
                        {errors.password_confirmation && <span className="text-danger">{errors.password_confirmation[0]}</span>}   
                      </div>    
                        <input type="submit" className="btn btn-pink w-100 my-3" value="Register"/>
                        <p className="text-center fs-5">Already have an account?</p>
                        <Link to = "/login" className="fs-5">Login</Link>
                    </form>
                </div>
                </div>
        </div>
    </div>
    )
  }
  
  export default RegistrationForm;

  export function meta({}: Route.MetaArgs) {
    return [
      { title: "Registration - Event Booking" },
    ];
  }