import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const RoomPage = () => {
  const { roomId } = useParams();
  const myMeeting = useRef(null);

  useEffect(() => {
    const myMettingFunc = async (element) => {
      const appId = Number(import.meta.env.VITE_APPID);
      const serverSecret = import.meta.env.VITE_SERVER_SECRET;

      console.log("appId:", appId);
      console.log("serverSecret:", serverSecret);

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomId,
        Date.now().toString(),
        "Vansh Agrawal"
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: element,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: true,
      });
    };

    if (myMeeting.current) {
      myMettingFunc(myMeeting.current);
    }
  }, [roomId]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Room ID: {roomId}</h2>
      <div
        ref={myMeeting}
        className="w-full h-[calc(100vh-10rem)] bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      />
    </div>
  );
};

export default RoomPage;
