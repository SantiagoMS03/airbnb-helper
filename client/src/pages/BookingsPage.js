import React, { useEffect, useState } from "react";
import { getBookings } from "../services/api";
import { useParams } from "react-router-dom";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [cleaningCompany, setCleaningCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { companyId } = useParams();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const bookings = await getBookings();
        setBookings(bookings);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [companyId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching properties: {error.message}</p>;

  return (
    <div>
      <h3>Bookings</h3>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.booking_id}>
            <p>Property ID: {booking.property_id}</p>
            <p>Start Date: {booking.start_date}</p>
            <p>End Date: {booking.end_date}</p>
            <p>Guest Number: {booking.guest_number}</p>
            <p>Confirmation Code: {booking.confirmation_code}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingsPage;
