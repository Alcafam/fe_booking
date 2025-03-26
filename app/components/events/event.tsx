import { useState, useEffect } from 'react';
import { Link } from "react-router";
import type { Route } from "./+types/dashboard";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import BookingModal from "../user/booking_modal";
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
  created_at:string,
  almost_full:boolean,
  booked:boolean,
  full_capacity: number
}

interface Booking {
  id: number;
  name: string;
  email: string;
}

const event = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuth();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [modalId, setModalId] = useState('');
  const [bookMode, setbookMode] = useState<'book' | 'cancel'>('book');

  const openModalForEdit = (id: string, modal:string) => {
    setbookMode('book');
    setIsBookModalOpen(true);
    setModalId(id);
  };

  const openModalForDelete = (id: string, modal:string) => {
    setbookMode('cancel');
    setIsBookModalOpen(true);
    setModalId(id);
  };

  const closeModal = () => {
    setIsBookModalOpen(false);
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/events/event_by_id/${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      const data = await response.data;
      setEvent(data);
    }catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  }

  const fetchBookingsData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bookings/get_bookings_by_id/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings data:', error);
    }
  };

  useEffect(() => {
    fetchBookingsData();
    fetchEvents();
  }, [])

  const truncateDescription = (text: string) => {
    if (!text) return '';  // Return an empty string if text is undefined or null
    return text.replace(/\n/g, '<br />');
  };

    return (
      <div>
        <Link to="/dashboard" className="fs-5 mx-5 mb-2 btn btn-primary">Back</Link>
        <BookingModal
          isOpen={isBookModalOpen}
          onClose={closeModal}
          id={modalId}
          mode={bookMode}
          refetchEvents={fetchEvents}
        />
        <div className="row px-5">
            <div key={event?.id} className="mb-4">
              <div className="card">
                <div className="card-body">
                  <div className='d-flex'>
                    <h1 className="card-title">{event.name}
                      {user?.user_type === "admin" && (
                        <span>({event.total_bookings}/{event.total_capacity})</span>
                      )}

                      {user?.user_type === "user" && event.full_capacity && (
                        <span className='text-danger'> (Fully Booked!)</span>
                      )}
                    </h1>
                    {user?.user_type === "admin" && (
                      <div className='position-absolute top-0 end-0 p-2 text-danger'>
                        <span>{event.almost_full ? 'Almost Full':''}</span>
                      </div>
                    )}
                  </div>
                  <p className="card-text" dangerouslySetInnerHTML={{ __html: truncateDescription(event?.description) }} />
                  <hr/>
                  <p className="card-text"><strong>Date:</strong> {event?.event_date} @ {event.event_time}</p>
                  <p className="card-text"><strong>Location:</strong> {event?.location}</p>
                  <p className="card-text"><strong>Remaining Slots:</strong> {event?.remaining_slot}</p>

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
        </div>

        {user?.user_type === "admin" && (
          <div className='mt-3 px-5'>
            <h1>Bookings</h1>
            {bookings.length === 0 ? (
              <p>No Bookings for this Event yet</p>
              ) : (
                <table className="table table-bordered table-light table-hover">
                  <thead>
                    <tr>
                      <th className='bg-lighter'></th>
                      <th className='bg-lighter' scope="col">Name</th>
                      <th className='bg-lighter' scope="col">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <tr key={booking.id}>
                        <td>{index + 1}</td>
                        <td>{booking.first_name} {booking.last_name}</td>
                        <td>{booking.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            )}
          </div>
        )}
      </div>
    )
  }
  
  export default event;