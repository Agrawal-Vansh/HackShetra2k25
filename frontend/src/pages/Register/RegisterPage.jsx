import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    id: "",
    password: "",
    phone: "",
    email: "",
    dob: "",
    gender: "",
    yearOfJoining: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    for (const field in formData) {
      if (!formData[field]) return handleError("All fields are required");
    }

    try {
      await axios.post(`${import.meta.env.VITE_URL}/auth/register`, formData);
      handleSuccess("Registration Successful");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      handleError(
        "Registration failed: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-100 text-center mb-8">Register</h1>
        <form className="space-y-6" onSubmit={handleRegister}>
          {[
            { name: "name", placeholder: "Name", type: "text" },
            { name: "id", placeholder: "ID", type: "text" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "phone", placeholder: "Phone", type: "tel" },
            { name: "dob", placeholder: "Date of Birth", type: "date" },
            { name: "yearOfJoining", placeholder: "Year of Joining", type: "number" },
            { name: "address", placeholder: "Address", type: "text" },
          ].map(({ name, placeholder, type }) => (
            <input
              key={name}
              type={type}
              name={name}
              onChange={handleChange}
              value={formData[name]}
              className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={placeholder}
              required
            />
          ))}
          <select
            name="gender"
            onChange={handleChange}
            value={formData.gender}
            className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 font-medium hover:text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
};

export default RegisterPage;
