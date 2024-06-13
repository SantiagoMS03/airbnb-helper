import React from "react";
import CompanyProperties from "./components/CompanyProperties";
import BookingsPage from "./pages/BookingsPage";
import Admin from "./pages/Admin";
import { Route, BrowserRouter, Routes } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/properties/:companyId" element={<CompanyProperties />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
