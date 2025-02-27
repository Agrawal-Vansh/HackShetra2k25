import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("startup");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: userType,
    name: "",
    companyInfo: {
      name: "",
      description: "",
      logo: "",
      industry: "",
      foundingDate: "",
      location: "",
      website: ""
    },
    funding: {
      stage: "",
      amountNeeded: "",
      equityOffering: ""
    },
    metrics: {
      revenue: "",
      users: "",
      growth: ""
    },
    investorInfo: {
      firmName: "",
      logo: "",
      description: "",
      website: "",
      location: ""
    },
    investmentCriteria: {
      minAmount: "",
      maxAmount: "",
      preferredStages: [],
      preferredIndustries: []
    },
    pastInvestments: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevFormData) => {
      if (type === "checkbox") {
        const field = name.split(".").pop(); // Extract 'preferredStages' or 'preferredIndustries'
        return {
          ...prevFormData,
          investmentCriteria: {
            ...prevFormData.investmentCriteria,
            [field]: checked
              ? [...prevFormData.investmentCriteria[field], value]
              : prevFormData.investmentCriteria[field].filter((item) => item !== value),
          },
        };
      } else {
        // Handle nested fields
        const keys = name.split("."); // Split the name into keys (e.g., ["companyInfo", "name"])
        if (keys.length > 1) {
          return {
            ...prevFormData,
            [keys[0]]: {
              ...prevFormData[keys[0]],
              [keys[1]]: value,
            },
          };
        } else {
          // Handle non-nested fields
          return {
            ...prevFormData,
            [name]: value,
          };
        }
      }
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log(formData);
  
    // Check for required fields
    const requiredFields = ["email", "password", "name"];
    if (userType === "startup") {
      requiredFields.push("companyInfo.name", "companyInfo.industry", "funding.stage", "funding.amountNeeded", "funding.equityOffering");
    } else if (userType === "investor") {
      requiredFields.push("investorInfo.firmName", "investmentCriteria.minAmount", "investmentCriteria.maxAmount");
    }
  
    for (const field of requiredFields) {
      if (!formData[field]) {
        return handleError(`Field ${field} is required`);
      }
    }
  
    try {
      await axios.post(`${import.meta.env.VITE_URL}/auth/register`, {
        ...formData,
        userType,
      });
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
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 text-white rounded-l-xl transition-all duration-300 ${userType === "startup" ? "bg-blue-600" : "bg-gray-600"
              }`}
            onClick={() => setUserType("startup")}
          >
            Startup
          </button>
          <button
            className={`px-4 py-2 text-white rounded-r-xl transition-all duration-300 ${userType === "investor" ? "bg-blue-600" : "bg-gray-600"
              }`}
            onClick={() => setUserType("investor")}
          >
            Investor
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-100 text-center mb-8">Register</h1>
        <form className="space-y-6" onSubmit={handleRegister}>
          {["email", "password", "name"].map((name) => (
            <input
              key={name}
              type={name === "password" ? "password" : "text"}
              name={name}
              onChange={handleChange}
              value={formData[name]}
              className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
              required
            />
          ))}
          {userType === "startup" && (
            <>
              <input type="text" name="companyInfo.name" placeholder="Company's Name" onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl" required />
              <input type="text" name="companyInfo.description" placeholder="Company's Brief Description" onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl" required />
              <select
                name="companyInfo.industry"
                onChange={handleChange}
                value={formData.companyInfo.industry}
                className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Industry</option>
                <option value="Tech">Tech</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="E-commerce">E-commerce</option>
                <option value="AI">AI</option>
                <option value="Blockchain">Blockchain</option>
                <option value="EdTech">EdTech</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="date"
                name="foundingDate"
                placeholder="Founding Date"
                onChange={handleChange}
                value={formData.companyInfo.foundingDate || ""}
                className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="companyInfo.location" // Corrected name
                onChange={handleChange}
                value={formData.companyInfo.location || ""}
                placeholder="Location"
                className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="url"
                name="companyInfo.website"
                onChange={handleChange}
                value={formData.companyInfo.website || ""}
                placeholder="Website"
                className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />


              <select
                name="funding.stage"
                onChange={handleChange}
                value={formData.funding?.stage || ""}
                className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Funding Stage</option>
                <option value="Pre-seed">Pre-seed</option>
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
                <option value="Series C">Series C</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="number"
                name="funding.amountNeeded"
                onChange={handleChange}
                value={formData.funding?.amountNeeded || ""}
                placeholder="Amount Needed ($)"
                className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="number"
                name="funding.equityOffering"
                onChange={handleChange}
                value={formData.funding.equityOffering || ""}
                placeholder="Equity Offering (%)"
                className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {/* Revenue */}
              <input
                type="number"
                name="metrics.revenue"
                onChange={handleChange}
                value={formData.metrics.revenue || ""}
                placeholder="Revenue ($)"
                className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Users */}
              <input
                type="number"
                name="metrics.users"
                onChange={handleChange}
                value={formData.metrics?.users}
                placeholder="Number of Users"
                className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Growth */}
              <input
                type="number"
                name="metrics.growth"
                onChange={handleChange}
                value={formData.metrics?.growth}
                placeholder="Growth (%)"
                className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </>
          )}
          {userType === "investor" && (
            <>
              <input type="text" name="investorInfo.firmName" placeholder="Firm Name" onChange={handleChange} value={formData.investorInfo.firmName} className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl" />
              <input type="text" name="investorInfo.description" placeholder="Firm's brief description" onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl" />
              <input type="text" name="investorInfo.website" placeholder="Firm website" onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl" />
              <input type="text" name="investorInfo.location" placeholder="Firm location" onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl" />
              <input type="number" name="investmentCriteria.minAmount" placeholder="Minimum Investment Amount" onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl" required />
              <input type="number" name="investmentCriteria.maxAmount" placeholder="Maximum Investment Amount" onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-xl" required />
              <div className="mb-4">
                <p className="text-gray-100">Select Preferred Funding Stages:</p>
                {["Pre-seed", "Seed", "Series A", "Series B", "Series C", "Other"].map((stage) => (
                  <label key={stage} className="flex items-center space-x-2 text-gray-100">
                    <input
                      type="checkbox"
                      name="investmentCriteria.preferredStages"
                      value={stage}
                      checked={formData.investmentCriteria.preferredStages.includes(stage)}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500"
                    />
                    <span>{stage}</span>
                  </label>
                ))}
              </div>

              <div className="mb-4">
                <p className="text-gray-100">Select Preferred Industries:</p>
                {["Tech", "Healthcare", "Finance", "E-commerce", "AI", "Blockchain", "EdTech", "Other"].map((industry) => (
                  <label key={industry} className="flex items-center space-x-2 text-gray-100">
                    <input
                      type="checkbox"
                      name="investmentCriteria.preferredIndustries"
                      value={industry}
                      checked={formData.investmentCriteria.preferredIndustries.includes(industry)}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500"
                    />
                    <span>{industry}</span>
                  </label>
                ))}
              </div>

            </>
          )}
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
