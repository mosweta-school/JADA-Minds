import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import ClientLayout from "../layouts/ClientLayout";
import AdminLayout from "../layouts/AdminLayout";
import SpecialistLayout from "../layouts/SpecialistLayout";

import Home from "../pages/shared/Home";
import Login from "../pages/auth/Login";
import NotFound from "../pages/shared/NotFound";

// Client Pages
import Dashboard from "../pages/client/Dashboard";
import Assessment from "../pages/client/Assessment";
import Results from "../pages/client/Results";
import Resources from "../pages/client/Resources";
import Specialists from "../pages/client/Specialists";
import Workshops from "../pages/client/Workshops";
import Profile from "../pages/client/Profile";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import AdminSpecialists from "../pages/admin/Specialists";
import AdminResources from "../pages/admin/Resources";
import AdminWorkshops from "../pages/admin/Workshops";
import Reports from "../pages/admin/Reports";
import AdminProfile from "../pages/admin/Profile";

// Specialist Pages
import SpecialistDashboard from "../pages/specialist/Dashboard";
import Assessments from "../pages/specialist/Assessments";
import Notes from "../pages/specialist/Notes";
import SpecialistProfile from "../pages/specialist/Profile";

function AppRoutes() {
  return (
    <Routes>
      {/* CLIENT */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["client"]}>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="assessment" element={<Assessment />} />
        <Route path="results" element={<Results />} />
        <Route path="resources" element={<Resources />} />
        <Route path="specialists" element={<Specialists />} />
        <Route path="workshops" element={<Workshops />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="specialists" element={<AdminSpecialists />} />
        <Route path="resources" element={<AdminResources />} />
        <Route path="workshops" element={<AdminWorkshops />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* SPECIALIST */}
      <Route
        path="/specialist"
        element={
          <ProtectedRoute allowedRoles={["specialist"]}>
            <SpecialistLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SpecialistDashboard />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="notes" element={<Notes />} />
        <Route path="profile" element={<SpecialistProfile />} />
      </Route>

      {/* PUBLIC */}
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;