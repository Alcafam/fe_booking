import React, { useState, useEffect } from 'react';
import { Link } from "react-router";
import type { Route } from "./+types/dashboard";
import CrudModal from "../admin/crud_modal";
import BookingModal from "./booking_modal";
import axios from 'axios';
import { useAuth } from '../AuthContext';

const API_URL = import.meta.env.VITE_API_URL;
interface Event {
  id: number,
  name: string,
  description: string,
  event_date: string,
  event_time: string,
  location: string,
  total_capacity: number,
  remaining_slot: number,
  total_bookings: number,
  created_at: string,
  almost_full: boolean,
  booked: boolean
  full_capacity: number
}

const dashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { user } = useAuth();
  const [pagination, setPagination] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [modalId, setModalId] = useState('');
  const [mode, setMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [bookMode, setbookMode] = useState<'book' | 'cancel'>('book');
  const [totalEvent, setTotalEvent] = useState('');

  const openModalForAdd = () => {
    setMode('add');
    setIsModalOpen(true);
  };

  const openModalForEdit = (id: string, modal:string) => {
    if(modal === 'CrudModal'){
      setMode('edit');
      setIsModalOpen(true);
    }else{
      setbookMode('book');
      setIsBookModalOpen(true);
    }
    setModalId(id);
  };

  const openModalForDelete = (id: string, modal:string) => {
    if(modal === 'CrudModal'){
      setMode('delete');
      setIsModalOpen(true);
    }else{
      setbookMode('cancel');
      setIsBookModalOpen(true);
    }
    setModalId(id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsBookModalOpen(false);
  };

    const refetchEvents = async (page = 1) => {
      try {
        const response = await axios.get(`${API_URL}/api/events/event_list?page=${page}`, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        const data = await response.data;
        const formattedProducts =
          data?.data?.map((event: Event) => ({
            id: event.id,
            name: event.name,
            description: event.description,
            event_date: event.event_date,
            event_time: event.event_time,
            location: event.location,
            total_capacity: event.total_capacity,
            remaining_slot: event.remaining_slot,
            total_bookings: event.total_bookings,
            created_at: event.created_at,
            almost_full: event.almost_full,
            booked: event.booked,
            full_capacity: event.full_capacity
          })) || [];

          setEvents(formattedProducts);
          setPagination(data);
          setTotalEvent(data.total);
      }catch (error) {
        console.error('An unexpected error occurred:', error);
      }
    }
  
    const handlePageChange = (url: string) => {
      const page = new URL(url).searchParams.get('page');
      if (page) {
        refetchEvents(parseInt(page, 10));
      }
    };

  useEffect(() => {
    refetchEvents();
  }, [])

  // Truncate description to 50 words and preserve newlines
  const truncateDescription = (text: string, wordLimit: number) => {
    const words = text.split(' ');
    const truncated = words.slice(0, wordLimit).join(' ');
    const hasMoreWords = words.length > wordLimit;
    const result = truncated + (hasMoreWords ? ' . . .' : '');

  return result.replace(/\n/g, '<br />');
  };

    return (
      <div>
        {user?.user_type === "admin" && (
          <div className='px-5 row'>
            <h2 className='col'>Total Event: {totalEvent}</h2>
              <div className="col text-end">
                <button className="btn btn-primary" onClick={openModalForAdd}>
                  Add Event
                </button>
              </div>
          </div>
        )} 
        <CrudModal
          isOpen={isModalOpen}
          onClose={closeModal}
          id={modalId}
          mode={mode}
          refetchEvents={refetchEvents}
        />

        <BookingModal
          isOpen={isBookModalOpen}
          onClose={closeModal}
          id={modalId}
          mode={bookMode}
          refetchEvents={refetchEvents}
        />
        <div className="my-5 row px-5">
          {events.map((event) => (
            <div key={event.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body position-relative">
                  <div className='d-flex'>
                    <h1 className="card-title">{event.name} 
                      {user?.user_type === "admin" && (
                        <span> ({event.total_bookings}/{event.total_capacity})</span>
                      )}

                      {user?.user_type === "user" && event.full_capacity && (
                        <span className='text-danger'> (Fully Booked!)</span>
                      )}
                    </h1>
                    {user?.user_type === "admin" && event.almost_full && (
                      <div className='position-absolute top-0 end-0 p-2 text-danger'>
                        <span>Almost Full</span>
                      </div>
                    )}

                    {user?.user_type === "user" && event.booked && (
                      <div className='position-absolute top-0 end-0 p-2 text-danger'>
                        <span>Booked</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Truncate the description */}
                  <p className="card-text" dangerouslySetInnerHTML={{ __html: truncateDescription(event.description, 50) }} />
                  <p className="card-text"><strong>Date:</strong> {event.event_date} @ {event.event_time}</p>
                  <p className="card-text"><strong>Location:</strong> {event.location}</p>
                  <div className="d-flex">
                    <p className="card-text"><strong>Remaining Slots:</strong> {event.remaining_slot}</p>
                  </div>                  
                  <Link to={`/view-details/${event.id}`} className="btn btn-primary">View</Link>
                  {user?.user_type === "admin" && (
                    <div className='d-inline'>
                      <button className="btn btn-primary" onClick={() => openModalForEdit('event-id-'+event.id, 'CrudModal')}>
                        Edit
                      </button>
                      <button className="btn btn-warning" onClick={() => openModalForDelete('event-id-'+event.id, 'CrudModal')}>
                        Delete
                      </button>
                    </div>
                  )}
                  {/* Only show the form if the user is an user */}
                    {user?.user_type === "user" && !event.full_capacity &&(
                      <button 
                        className={`ms-1 btn ${!event.booked ? 'btn-success' : 'btn-danger'}`} 
                        onClick={() => 
                          {event.booked ? openModalForDelete('event-id-'+event.id, 'BookModal') : openModalForEdit('event-id-'+event.id, 'BookModal')}
                        }
                      >
                      {event.booked ? 'Cancel' : 'Book'}
                    </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Links */}
        <div className="d-flex justify-content-center">
          {pagination.prev_page_url && (
            <button className="btn btn-secondary mx-2" onClick={() => handlePageChange(pagination.prev_page_url)}>
              Previous
            </button>
          )}

          {pagination.next_page_url && (
            <button className="btn btn-secondary mx-2" onClick={() => handlePageChange(pagination.next_page_url)}>
              Next
            </button>
          )}
        </div>
      </div>
    );
  }
  
  export default dashboard;

  export function meta({}: Route.MetaArgs) {
    return [
      { title: "Dashboard - Event Booking" },
    ];
  }