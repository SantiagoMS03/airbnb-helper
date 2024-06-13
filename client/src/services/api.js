import axios from "axios";

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Properties API
export const getProperties = async () => {
  try {
    const response = await api.get("/properties");
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

export const getPropertyById = async (id) => {
  try {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching property with id ${id}:`, error);
    throw error;
  }
};

export const createProperty = async (propertyData) => {
  try {
    const response = await api.post("/properties", propertyData);
    return response.data;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

export const updateProperty = async (id, propertyData) => {
  try {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  } catch (error) {
    console.error(`Error updating property with id ${id}:`, error);
    throw error;
  }
};

export const deleteProperty = async (id) => {
  try {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting property with id ${id}:`, error);
    throw error;
  }
};

// Returns an array of bookings
export const getBookingsForProperty = async (id) => {
  console.log("id is " + id);
  try {
    const bookings = await api.get(`/properties/${id}/bookings`);
    console.log("bookings are ...");
    console.log(bookings.data);
    console.log("len is " + bookings.data.length);
    console.log("hi here");
    const response = [];
    for (let i = 0; i < bookings.data.length; i++) {
      console.log("iterating over booking...");
      console.log(bookings.data[i]);
      response.push(bookings.data[i]);
      console.log("response now is...");
      console.log(response);
    }
    console.log("response is ...");
    console.log(response);
    console.log("yay");

    return response;
  } catch (error) {
    console.error(`Error fetching bookings for property with id ${id}:`, error);
    throw error;
  }
};

export const getBookingsAndPropertiesForCompany = async (companyId) => {
  try {
    const properties = await getPropertiesForCleaningCompany(companyId);
    const bookings = await getBookingsForProperties(properties);
    return [bookings, properties];
  } catch (error) {
    console.error(
      `Error fetching bookings for company with id ${companyId}:`,
      error
    );
    throw error;
  }
};

// Returns array of bookings
export const getBookingsForProperties = async (properties) => {
  let response = [];
  for (let property of properties) {
    const bookings = await getBookingsForProperty(property.property_id);
    console.log("bookings are...");
    console.log(bookings);
    for (let i = 0; bookings && i < bookings.length; i++) {
      // response.push(booking.data);
      response.push(bookings[i]);
    }
  }
  console.log("returning...");
  console.log(response);
  return response;
};

// Bookings API
export const getBookings = async () => {
  try {
    const response = await api.get("/bookings");
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking with id ${id}:`, error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const updateBooking = async (id, bookingData) => {
  try {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  } catch (error) {
    console.error(`Error updating booking with id ${id}:`, error);
    throw error;
  }
};

export const deleteBooking = async (id) => {
  try {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting booking with id ${id}:`, error);
    throw error;
  }
};

// Cleaning Companies API
export const getCleaningCompanies = async () => {
  try {
    const response = await api.get("/cleaning-companies");
    return response.data;
  } catch (error) {
    console.error("Error fetching cleaning companies:", error);
    throw error;
  }
};

export const getCleaningCompanyById = async (id) => {
  try {
    const response = await api.get(`/cleaning-companies/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cleaning company with id ${id}:`, error);
    throw error;
  }
};

export const createCleaningCompany = async (companyData) => {
  try {
    const response = await api.post("/cleaning-companies", companyData);
    return response.data;
  } catch (error) {
    console.error("Error creating cleaning company:", error);
    throw error;
  }
};

export const updateCleaningCompany = async (id, companyData) => {
  try {
    const response = await api.put(`/cleaning-companies/${id}`, companyData);
    return response.data;
  } catch (error) {
    console.error(`Error updating cleaning company with id ${id}:`, error);
    throw error;
  }
};

export const deleteCleaningCompany = async (id) => {
  try {
    const response = await api.delete(`/cleaning-companies/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting cleaning company with id ${id}:`, error);
    throw error;
  }
};

export const getPropertiesForCleaningCompany = async (id) => {
  try {
    const response = await api.get(`/cleaning-companies/${id}/properties`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching properties for cleaning company with id ${id}:`,
      error
    );
    throw error;
  }
};
