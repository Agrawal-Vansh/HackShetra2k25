import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage.jsx";
import PageNotFound from "./pages/PageNotFound/PageNotFound.jsx";
import Layout from "./layout/Homelayout.jsx";
import RegisterPage from "./pages/Register/RegisterPage.jsx";
import VideoHome from "./pages/VideoCall/VideoHome.jsx";
import RoomPage from "./pages/VideoCall/RoomPage.jsx";
import Home from "./Pages/Home/Home.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/video" element={<VideoHome />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
