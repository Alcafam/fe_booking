import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string; 
  mode: 'book' | 'cancel' ;
  refetchEvents: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;
const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, id, mode, refetchEvents }) => {
const [bookMess, setbookMess] = useState('');

const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        let response;
        let pureEventId = id.replace('event-id-', '');
        if (mode === 'cancel') {
          response = await axios.delete(`${API_URL}/api/bookings/delete_booking/${pureEventId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
          });
        } else {
          response = await axios.post(`${API_URL}/api/bookings/book_event/${pureEventId}`, {}, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
          });
        }
        const data = await response?.data;

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
      } catch (error) {
        console.error('Error updating booking:', error);
      }
    refetchEvents();
    onClose();
};

useEffect(() => {
    if(mode === 'book'){
        setbookMess('Are you sure you want to Book?');
    }else{
        setbookMess('Are you sure you want to Cancel?');
    }
})

  return (
    <div
      className={`modal fade ${isOpen ? 'show' : ''}`} 
      id={id} 
      tabIndex={-1} 
      aria-labelledby={`${id}Label`} 
      aria-hidden={!isOpen}
      style={{ display: isOpen ? 'block' : 'none' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-lighter">
          <div className="modal-header">
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <h2>{bookMess}</h2>
            <div className='text-end'>
                <button 
                    className="ms-1 text-end btn btn-danger" 
                    onClick={onClose} 
                    data-bs-dismiss="modal"
                >
                        Cancel
                </button>
                <button 
                    className="ms-1 text-end btn btn-success"
                    onClick={handleFormSubmit}
                >
                        Yes
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

