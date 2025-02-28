import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [fundingProposals, setFundingProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState(localStorage.getItem("userType"));

  // Get user email from localStorage
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    if (!userEmail) {
      setError("User email not found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchFundingDetails = async () => {
      try {
        const url =
          userType === "startup"
            ? `http://localhost:8000/api/funding/detail/${userEmail}`
            : `http://localhost:8000/api/funding/detail/investor/${userEmail}`;
        
        const response = await axios.get(url);
        setFundingProposals(response.data);
      } catch (err) {
        setError("Failed to fetch funding proposals.");
      } finally {
        setLoading(false);
      }
    };

    fetchFundingDetails();
  }, [userEmail, userType]); // Runs when userEmail or userType changes

  const handleStatusChange = async (proposalId, startupEmail, newStatus) => {
    try {
      await axios.patch("http://localhost:8000/api/funding/update-status", {
        startupEmail,
        status: newStatus,
      });
      
      setFundingProposals((prevProposals) =>
        prevProposals.map((proposal) =>
          proposal._id === proposalId ? { ...proposal, status: newStatus } : proposal
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading funding proposals...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Funding Proposals</h2>
      
      {fundingProposals.length === 0 ? (
        <p className="text-gray-600 text-center">No funding proposals yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-600 text-white">
                {userType === "startup" ? (
                  <>
                    <th className="p-3 border">Investor Name</th>
                    <th className="p-3 border">Investor Email</th>
                  </>
                ) : (
                  <>
                    <th className="p-3 border">Startup Name</th>
                    <th className="p-3 border">Startup Email</th>
                  </>
                )}
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Equity (%)</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Notes</th>
                {userType === "investor" && <th className="p-3 border">Update Status</th>}
              </tr>
            </thead>
            <tbody>
              {fundingProposals.map((proposal) => (
                <tr key={proposal._id} className="text-center odd:bg-gray-100 even:bg-white">
                  {userType === "startup" ? (
                    <>
                      <td className="p-3 border">{proposal.investorId.name}</td>
                      <td className="p-3 border">{proposal.investorId.email}</td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 border">{proposal.startupId.name}</td>
                      <td className="p-3 border">{proposal.startupId.email}</td>
                    </>
                  )}
                  <td className="p-3 border">₹{proposal.amount.toLocaleString()}</td>
                  <td className="p-3 border">{proposal.equity}%</td>
                  <td className="p-3 border font-semibold text-blue-600">{proposal.status}</td>
                  <td className="p-3 border text-gray-700">{proposal.notes}</td>
                  {userType === "investor" && (
                    <td className="p-3 border">
                      <select
                        className="border p-2 rounded"
                        value={proposal.status}
                        onChange={(e) =>
                          handleStatusChange(proposal._id, proposal.startupId.email, e.target.value)
                        }
                      >
                        {["proposed", "reviewing", "accepted", "rejected"].map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
