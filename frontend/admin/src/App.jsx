import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Admin/Login';
import PCReview from './pages/Admin/PCReview';
import ProtectedRoute from './pages/Admin/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/review" element={
          <ProtectedRoute element={<PCReview />} allowRoles={['admin', 'auditor']} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
