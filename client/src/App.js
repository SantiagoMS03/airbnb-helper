import React from "react";
import CompanyProperties from "./components/CompanyProperties";
import Admin from "./pages/Admin";
import { Route, BrowserRouter, Routes } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/properties/:companyId" element={<CompanyProperties />} />
        {/* <Route path="/bookings/:companyId" element={<CompanyBookings />} /> */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
