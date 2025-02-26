import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../components/areas/Admin/Dashboard';
import Usuario from '../components/areas/Admin/Usuario';
import Update from '../components/areas/Admin/Update';
import ProtectedRoute from '../components/common/ProtectedRoute';



const AdminRoutes = ({ userRole }) => (
    <Routes>
        <Route
            path="dashboard"
            element={
                <ProtectedRoute userRole={userRole} allowedRole={1}>
                    <Dashboard />
                </ProtectedRoute>
            }
        />

        <Route
            path="usuario"
            element={
                <ProtectedRoute userRole={userRole} allowedRole={1}>
                    <Usuario />
                </ProtectedRoute>
            }
        />

        <Route
            path="Update"
            element={
                <ProtectedRoute userRole={userRole} allowedRole={1}>
                    <Update />
                </ProtectedRoute>
            }
        />
    </Routes>

        

);

export default AdminRoutes;