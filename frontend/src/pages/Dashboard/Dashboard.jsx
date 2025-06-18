import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [fundingProposals, setFundingProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState(localStorage.getItem("userType"));

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
        setError("No funding proposals exists.");
      } finally {
        setLoading(false);
      }
    };

    fetchFundingDetails();
  }, [userEmail, userType]);

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

  if (loading) return <p className="text-center text-gray-400">Loading funding proposals...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full p-6 bg-gray-950 text-white shadow-lg">
      <h2 className="text-3xl font-bold text-blue-400 text-center mb-6">Funding Proposals</h2>

      {fundingProposals.length === 0 ? (
        <p className="text-gray-400 text-center">No funding proposals yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-800 bg-gray-900 text-gray-300">
            <thead>
              <tr className="bg-blue-600 text-white">
                {userType === "startup" ? (
                  <>
                    <th className="p-3 border border-gray-700">Investor Name</th>
                    <th className="p-3 border border-gray-700">Investor Email</th>
                  </>
                ) : (
                  <>
                    <th className="p-3 border border-gray-700">Startup Name</th>
                    <th className="p-3 border border-gray-700">Startup Email</th>
                  </>
                )}
                <th className="p-3 border border-gray-700">Amount</th>
                <th className="p-3 border border-gray-700">Equity (%)</th>
                <th className="p-3 border border-gray-700">Status</th>
                <th className="p-3 border border-gray-700">Notes</th>
                {userType === "investor" && <th className="p-3 border border-gray-700">Update Status</th>}
              </tr>
            </thead>
            <tbody>
              {fundingProposals.map((proposal) => (
                <tr
                  key={proposal._id}
                  className="text-center odd:bg-gray-800 even:bg-gray-850 hover:bg-gray-700 transition duration-200"
                >
                  {userType === "startup" ? (
                    <>
                      <td className="p-3 border border-gray-700">{proposal.investorId.name}</td>
                      <td className="p-3 border border-gray-700">{proposal.investorId.email}</td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 border border-gray-700">{proposal.startupId.name}</td>
                      <td className="p-3 border border-gray-700">{proposal.startupId.email}</td>
                    </>
                  )}
                  <td className="p-3 border border-gray-700">₹{proposal.amount.toLocaleString()}</td>
                  <td className="p-3 border border-gray-700">{proposal.equity}%</td>

                  {/* Dynamic status color based on the proposal status */}
                  <td
                    className={`p-3 border border-gray-700 font-bold uppercase ${
                      proposal.status === "proposed"
                        ? "text-yellow-400"
                        : proposal.status === "reviewing"
                        ? "text-orange-400"
                        : proposal.status === "accepted"
                        ? "text-green-400"
                        : "text-red-500"
                    }`}
                  >
                    {proposal.status.toUpperCase()}
                  </td>

                  <td className="p-3 border border-gray-700 text-gray-400">{proposal.notes}</td>
                  {userType === "investor" && (
                    <td className="p-3 border border-gray-700">
                      <select
                        className="bg-gray-900 border border-gray-600 text-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={proposal.status}
                        onChange={(e) =>
                          handleStatusChange(proposal._id, proposal.startupId.email, e.target.value)
                        }
                      >
                        {["proposed", "reviewing", "accepted", "rejected"].map((statusOption) => (
                          <option key={statusOption} value={statusOption} className="bg-gray-900 text-white">
                            {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
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
