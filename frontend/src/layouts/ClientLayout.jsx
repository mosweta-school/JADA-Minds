import { Outlet } from "react-router-dom";

import Navbar from "../components/navigation/Navbar";
import Sidebar from "../components/navigation/Sidebar";
import Footer from "../components/navigation/Footer";

function ClientLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default ClientLayout;