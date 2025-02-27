import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { handleError, handleSuccess } from "../../utils";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let { email, password } = formData;

    if (!email || !password) {
      return handleError("All fields are required");
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/auth/login`, {
        email,
        password,
      });

      const { message, name, success, token, profilePhoto, userType } = res.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("loggedInUser", name);
      localStorage.setItem("userType", userType);
      
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      handleSuccess(message);
      setTimeout(() => {
        navigate(`/`);
      }, 1000);
    } catch (error) {
      handleError(
        "Login failed: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = async (response) => {
    try {
      const googleToken = response.credential;
      const res = await axios.get(`${import.meta.env.VITE_URL}/auth/google/callback`, {
        params: { token: googleToken },
      });

      const { message, name, token, profilePhoto, userType } = res.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("loggedInUser", name);
      localStorage.setItem("profilePhoto", profilePhoto);
      localStorage.setItem("userType", userType);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      handleSuccess(message);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      handleError("Google login failed: " + error.message);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-100 text-center mb-8">Login</h1>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
                required
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                value={formData.password}
                className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 rounded-xl hover:from-blue-600 hover:to-purple-700"
            >
              Login
            </button>
          </form>
          <div className="my-6 text-center">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex-1 h-px bg-gray-600"></div>
              <span className="text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-600"></div>
            </div>
            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={(error) => console.log("Google login error", error)}
                theme="filled_blue"
                shape="pill"
                size="large"
                text="signin_with"
                logo_alignment="left"
              />
            </div>
          </div>
          <p className="text-sm text-gray-400 text-center mt-6">
            New User? {" "}
            <Link
              to="/register"
              className="text-blue-400 font-medium hover:text-blue-500"
            >
              Register
            </Link>
          </p>
          <ToastContainer />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;
