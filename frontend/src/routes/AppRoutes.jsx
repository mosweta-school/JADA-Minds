import { Routes, Route } from "react-router-dom";

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

import Dashboard from "../pages/client/Dashboard";
import Assessment from "../pages/client/Assessment";
import Results from "../pages/client/Results";
import Resources from "../pages/client/Resources";
import Specialists from "../pages/client/Specialists";
import Workshops from "../pages/client/Workshops";
import Profile from "../pages/client/Profile";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
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

      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
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