// FormComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL;
const EventForm = ({ onSubmit, formData: initialFormData, mode, initialdeleteMess }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [deleteMess, setMess] = useState('');

  useEffect(() => {
    setErrors({});
    setFormData(initialFormData);
    setMess(initialdeleteMess);
  }, [initialFormData,initialdeleteMess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Reset previous errors
    try {
        let response;
        if (mode === 'edit') {
            response = await axios.put(`${API_URL}/api/events/update_event/${formData.id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                },
            });
        } else if (mode === 'delete') {
            response = await axios.delete(`${API_URL}/api/events/delete_event/${formData.id}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                }}
            );
        } else {
            response = await axios.post(`${API_URL}/api/events/add_event`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                },
            });
        }
        const data = await response?.data;
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
        setErrors(data.errors);
      }else{
        onSubmit(formData);
      }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
    }
  };

  if (mode === 'delete') {
    return (
      <div>
        <h2>{deleteMess}</h2>
        <div className="d-flex">
          <button
            className="btn btn-danger me-2"
            onClick={handleSubmit}
          >
            Yes, Delete
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onSubmit(null)}  // This will close the form without deleting
          >
            No, Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">Event Name:</label>
            <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            />
            {errors.name && <p className="text-danger">{errors.name}</p>}
        </div>

        <div className="mb-3">
            <label htmlFor="description" className="form-label">Description:</label>
            <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows="3"
            />
            {errors.description && <p className="text-danger">{errors.description}</p>}
        </div>

        <div className="mb-3">
            <label htmlFor="event_date" className="form-label">Event Date:</label>
            <input
            type="date"
            id="event_date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            className="form-control"
            />
            {errors.event_date && <p className="text-danger">{errors.event_date}</p>}
        </div>

        <div className="mb-3">
            <label htmlFor="event_time" className="form-label">Event Time:</label>
            <input
            type="time"
            id="event_time"
            name="event_time"
            value={formData.event_time}
            onChange={handleChange}
            className="form-control"
            />
            {errors.event_time && <p className="text-danger">{errors.event_time}</p>}
        </div>

        <div className="mb-3">
            <label htmlFor="location" className="form-label">Location:</label>
            <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-control"
            />
            {errors.location && <p className="text-danger">{errors.location}</p>}
        </div>

        <div className="mb-3">
            <label htmlFor="total_capacity" className="form-label">Total Capacity:</label>
            <input
            type="number"
            id="total_capacity"
            name="total_capacity"
            value={formData.total_capacity}
            onChange={handleChange}
            className="form-control"
            />
            {errors.total_capacity && <p className="text-danger">{errors.total_capacity}</p>}
        </div>

        <button type="submit" className="btn btn-secondary">{mode === 'edit' ? 'Update' : 'Submit'}</button>
    </form>

  );
};

export default EventForm;