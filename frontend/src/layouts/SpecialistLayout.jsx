import { Outlet } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import Sidebar from "../components/navigation/Sidebar";
import Footer from "../components/navigation/Footer";

function SpecialistLayout() {
  return (
    <>
      <Navbar />

      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 130px)",
        }}
      >
        <Sidebar />

        <main
          style={{
            flex: 1,
            padding: "2rem",
            background: "#faf8ff",
          }}
        >
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
}

export default SpecialistLayout;