import React, { useEffect, useState } from "react";
import {
  getBookingsAndPropertiesForCompany,
  getCleaningCompanyById,
  getBookingsForCompany,
} from "../services/api";
import { useParams } from "react-router-dom";

const CompanyProperties = () => {
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [cleaningCompany, setCleaningCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { companyId } = useParams();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const [bookings, properties] = await getBookingsAndPropertiesForCompany(
          companyId
        );
        const cleaningCompany = await getCleaningCompanyById(companyId);
        console.log("bookings are...");
        console.log(bookings);
        setBookings(bookings);
        setProperties(properties);
        setCleaningCompany(cleaningCompany);
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
      <h2>
        Properties for {cleaningCompany.company_name}, Company ID: {companyId}
      </h2>
      <ul>
        {properties.map((property) => (
          <li key={property.property_id}>
            <p>ID: {property.property_id}</p>
            <p>Address: {property.address}</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Type: {property.property_type}</p>
          </li>
        ))}
      </ul>
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

export default CompanyProperties;
