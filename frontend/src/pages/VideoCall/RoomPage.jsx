import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const RoomPage = () => {
  const { roomId } = useParams();
  const myMeeting = useRef(null); // Using useRef for the container reference

  useEffect(() => {
    const myMettingFunc = async (element) => {
      // Ensure you are using the correct App ID and Server Secret from the environment variables
      const appId = Number(import.meta.env.VITE_APPID); // Ensure it's a number
      const serverSecret = import.meta.env.VITE_SERVER_SECRET; // Keep it as a string

      console.log("appId:", appId);
      console.log("serverSecret:", serverSecret);

      // Generate the kit token for test purposes
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomId, // Use roomId from URL params
        Date.now().toString(), // Use the current timestamp for the user ID (this can be dynamic)
        "Vansh Agrawal" // User name
      );

      // Initialize the ZEGOCLOUD UI Kit Prebuilt instance
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      // Join the room
      zp.joinRoom({
        container: element, // The container for video/audio
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // Scenario for 1-on-1 call
        },
        showScreenSharingButton: true, // Show the screen sharing button
      });
    };

    // Call the meeting function only once after the component mounts
    if (myMeeting.current) {
      myMettingFunc(myMeeting.current);
    }
  }, [roomId]); // Re-run when roomId changes

  return (
    <div>
      <h2>Room ID: {roomId}</h2>
      {/* The div will be used by ZEGOCLOUD UI Kit to place the video UI */}
      <div ref={myMeeting} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default RoomPage;
