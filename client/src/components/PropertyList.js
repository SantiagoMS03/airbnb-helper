// prob not useful
import React, { useEffect, useState } from 'react';
import { getProperties } from '../services/api';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching properties: {error.message}</p>;

  return (
    <div>
      <h1>Property List</h1>
      <ul>
        {properties.map((property) => (
          <li key={property.property_id}>
            <p>Address: {property.address}</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Type: {property.property_type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;
