import React, { useState, useEffect } from "react";
import axios from "axios";

const PopUp = ({ isOpen, onClose, startupEmail }) => {
    const [formData, setFormData] = useState({
        startupEmail: "",
        investorEmail: localStorage.getItem("email"),
        amount: "",
        equity: "",
        notes: "",
    });

    // ✅ Ensure startupEmail updates when popup opens
    useEffect(() => {
        if (isOpen) {
            setFormData((prev) => ({
                ...prev,
                startupEmail: startupEmail || "", // ✅ Update startupEmail dynamically
            }));
        }
    }, [startupEmail, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_URL}/api/funding/initiate`, formData);
            alert("Funding request sent successfully!");
            setFormData({
                startupEmail: startupEmail || "",
                investorEmail: localStorage.getItem("email"),
                amount: "",
                equity: "",
                notes: "",
            });
            onClose();
        } catch (error) {
            console.error("Error sending funding request:", error.response?.data || error.message);
            alert("Failed to send funding request.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Funding Proposal</h2>

                <label className="block mb-2">
                    <span className="text-gray-400">Startup Email</span>
                    <p className="w-full bg-gray-800 p-2 rounded-lg">{formData.startupEmail}</p>
                </label>

                <label className="block mb-2">
                    <span className="text-gray-400">Investor Email</span>
                    <p className="w-full bg-gray-800 p-2 rounded-lg">{formData.investorEmail}</p>
                </label>

                <label className="block mb-2">
                    <span className="text-gray-400">Amount</span>
                    <input 
                        type="number" 
                        name="amount"
                        value={formData.amount} 
                        onChange={handleChange} 
                        className="w-full bg-gray-800 p-2 rounded-lg"
                        required
                    />
                </label>

                <label className="block mb-2">
                    <span className="text-gray-400">Equity (%)</span>
                    <input 
                        type="number" 
                        name="equity"
                        value={formData.equity} 
                        onChange={handleChange} 
                        className="w-full bg-gray-800 p-2 rounded-lg"
                        required
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-gray-400">Notes</span>
                    <textarea 
                        name="notes"
                        value={formData.notes} 
                        onChange={handleChange} 
                        className="w-full bg-gray-800 p-2 rounded-lg"
                        required
                    />
                </label>

                <div className="flex justify-between">
                    <button onClick={handleSubmit} className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700">
                        Submit
                    </button>
                    <button onClick={onClose} className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopUp;
