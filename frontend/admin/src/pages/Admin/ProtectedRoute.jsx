import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element, allowRoles }) {
  const userRole = localStorage.getItem('role');
  if (!userRole || (allowRoles && !allowRoles.includes(userRole))) {
    alert('无权限或未登录，将跳转到登录页');
    return <Navigate to="/" replace />;
  }
  return element;
}

export default ProtectedRoute;
