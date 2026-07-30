import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import ClientLayout from "../layouts/ClientLayout";
import AdminLayout from "../layouts/AdminLayout";
import SpecialistLayout from "../layouts/SpecialistLayout";
import ClientLayout from "../layouts/ClientLayout";
import {ProtectedRoute} from "./ProtectedRoute";

import Home from "../pages/shared/Home";
import Login from "../pages/auth/Login";
import NotFound from "../pages/shared/NotFound";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import MFAVerification from "../pages/auth/MFAVerification";

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
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/mfa-verify" element={<MFAVerification />} />
    </Routes>
  );
}

export default AppRoutes;