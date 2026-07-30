import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/shared/LandingPage";
import ClientLayout from "../layouts/ClientLayout";
import Login from "../pages/auth/Login";
import NotFound from "../pages/shared/NotFound";
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
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ClientLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="assessment" element={<Assessment />} />
        <Route path="results" element={<Results />} />
        <Route path="resources" element={<Resources />} />
        <Route path="specialists" element={<Specialists />} />
        <Route path="workshops" element={<Workshops />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
