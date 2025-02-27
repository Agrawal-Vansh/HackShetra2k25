import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VideoHome = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const senderMail = localStorage.getItem("email");
  const senderName = localStorage.getItem("loggedInUser");
  const recieverMail = location.state?.email;
  console.log(senderMail)
  console.log(recieverMail)
  console.log(senderName)

  const generateRoomId = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit room ID
    setRoomId(randomId.toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-100 text-center mb-6">Join Room</h2>
        
        {/* Generate Room ID Button */}
        <button
          onClick={generateRoomId}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 mb-4"
        >
          Generate Room ID
        </button>

        {/* Display Generated Room ID */}
        {roomId && (
          <div className="text-center text-lg font-semibold text-green-400 bg-gray-700 py-2 px-4 rounded-lg">
            Room ID: {roomId}
          </div>
        )}

        {/* Submit Button */}
        <form onSubmit={handleSubmit} className="mt-6">
          <button
            type="submit"
            disabled={!roomId}
            className={`w-full py-3 rounded-xl font-medium transition ${
              roomId
                ? "bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            Go to Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoHome;
