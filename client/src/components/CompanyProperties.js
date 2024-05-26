import React, { useEffect, useState } from 'react';
import { getPropertiesForCleaningCompany, getCleaningCompanyById } from '../services/api';

const CompanyProperties = ({ companyId }) => {
  const [properties, setProperties] = useState([]);
  const [cleaningCompany, setCleaningCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const properties = await getPropertiesForCleaningCompany(companyId);
        const cleaningCompany = await getCleaningCompanyById(companyId)
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
      <h1>Properties for {cleaningCompany.company_name}, Company ID: {companyId}</h1>
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

export default CompanyProperties;
