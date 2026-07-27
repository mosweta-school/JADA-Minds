import { Outlet } from "react-router-dom";

import Navbar from "../components/navigation/Navbar";
import Sidebar from "../components/navigation/Sidebar";
import Footer from "../components/navigation/Footer";

function ClientLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "1.5rem", background: "linear-gradient(135deg, #f5f1ff 0%, #faf5ff 100%)", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default ClientLayout;