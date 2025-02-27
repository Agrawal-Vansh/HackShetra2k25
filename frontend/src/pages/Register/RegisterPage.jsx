import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "",
    name: "",
    profilePhoto: "",
    companyInfo: {
      name: "",
      description: "",
      logo: "",
      industry: "",
      foundingDate: "",
      location: "",
      website: "",
    },
    funding: {
      stage: "",
      amountNeeded: "",
      equityOffering: "",
    },
    investorInfo: {
      firmName: "",
      logo: "",
      description: "",
      website: "",
      location: "",
    },
    investmentCriteria: {
      minAmount: "",
      maxAmount: "",
      preferredStages: "",
      preferredIndustries: "",
    },
    pastInvestments: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    for (const field in formData) {
      if (!formData[field] && typeof formData[field] !== "object") {
        return handleError("All fields are required");
      }
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
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            required
          />
          <select
            name="userType"
            onChange={handleChange}
            value={formData.userType}
            className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select User Type</option>
            <option value="startup">Startup</option>
            <option value="investor">Investor</option>
          </select>
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
