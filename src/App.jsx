import { Routes, Route } from "react-router-dom";
import Landing from "./pages/landing/Landing";
import Dashboard from "./pages/dashboard/Dashboard";
import HeaderNavbar from "./pages/landing/HeaderNavbar";
import Footer from "./pages/landing/Footer";

export default function App() {
  return (
    <>
      <HeaderNavbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </>
  );
}
