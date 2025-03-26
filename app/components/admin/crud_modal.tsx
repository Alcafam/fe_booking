import React, { useState, useEffect } from 'react';
import FormComponent from './event_form';
import axios from 'axios';

interface CrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;  // Add an id prop to identify the modal
  mode: 'add' | 'edit' | 'delete';
  refetchEvents: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;
const CrudModal: React.FC<CrudModalProps> = ({ isOpen, onClose, id, mode, refetchEvents }) => {
  const [eventData, setEventData] = useState({
    id: '',
    name: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    total_capacity: '',
  });

  const clean_form = () => {
    setEventData({
      id: '',
      name: '',
      description: '',
      event_date: '',
      event_time: '',
      location: '',
      total_capacity: '',
    });
    onClose();
  }

  const [deleteMess, setDeleteMess] = useState('');

  // Fetch the event data if we're in "edit" mode
  useEffect(() => {
    if ((mode === 'edit' || mode === 'delete') && id) {
      const fetchEventData = async () => {
        let pureEventId = id.replace('event-id-', '');
        try {
          const response = await axios.get(`${API_URL}/api/events/event_by_id/${pureEventId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
          });
          response.data.event_date = response.data.event_date.split(" ")[0];
          setEventData({
            ...response.data,
            id: response.data.id,  // Add the id dynamically to eventData
          });
        } catch (error) {
          console.error('Error fetching event data:', error);
        }
      };
      fetchEventData();
    }
    
    if (mode === 'delete'){
      const fetcMess = async () => {
        let pureEventId = id.replace('event-id-', '');
        try {
            const response = await axios.get(`${API_URL}/api/events/check_if_deletable/${pureEventId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                },
            });
            console.log(response);
            setDeleteMess(response.data.message);
        } catch (error) {
            console.error('Error fetching event data:', error);
        }
      };
      fetcMess();
    }
  }, [mode, id]);

  const handleFormSubmit = (formData) => {
    refetchEvents();
    clean_form(); 
  };

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
            {mode === 'add'? 'Add Event' : (mode === 'edit'? 'Edit Event' : '')}
            <button
              type="button"
              className="btn-close"
              onClick={clean_form}
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <FormComponent 
              onSubmit={handleFormSubmit}
              formData={eventData}  // Pass the form data to FormComponent
              mode={mode} 
              initialdeleteMess={deleteMess} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudModal;

