import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VideoHome = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRoomId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div>
      <h2>Enter Room ID</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={roomId}
          onChange={handleChange}
          placeholder="Room ID"
        />
        <button type="submit">Go to Room</button>
      </form>
    </div>
  );
};

export default VideoHome;
