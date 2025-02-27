import React from "react";

const Card = ({ company }) => {
    
  const { name, description, logo, industry, foundingDate, location, website } = company?.companyInfo || {};
  const { stage, amountNeeded, equityOffering } = company?.funding || {};
  const { revenue, users, growth } = company?.metrics || {};

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm mx-auto text-white transform transition-transform duration-300 hover:scale-105">
      {/* Header */}
      <div className="flex items-center mb-4">
        <img src={logo} alt={`${name} logo`} className="w-12 h-12 rounded-full mr-4" />
        <h2 className="text-xl font-bold">{name}</h2>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4">{description}</p>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="font-semibold">Industry:</span>
          <span className="text-gray-400">{industry}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Founded:</span>
          <span className="text-gray-400">{foundingDate ? new Date(foundingDate).toLocaleDateString() : "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Location:</span>
          <span className="text-gray-400">{location || "N/A"}</span>
        </div>
      </div>

      {/* Funding Details */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Funding Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">Stage:</span>
            <span className="text-gray-400">{stage || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Amount Needed:</span>
            <span className="text-gray-400">${amountNeeded ? amountNeeded.toLocaleString() : "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Equity Offering:</span>
            <span className="text-gray-400">{equityOffering ? `${equityOffering}%` : "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Metrics</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">Revenue:</span>
            <span className="text-gray-400">${revenue ? revenue.toLocaleString() : "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Users:</span>
            <span className="text-gray-400">{users ? users.toLocaleString() : "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Growth:</span>
            <span className="text-gray-400">{growth ? `${growth}%` : "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Website Link */}
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Visit Website
        </a>
      )}
    </div>
  );
};

export default Card;
