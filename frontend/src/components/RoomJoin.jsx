import React, { useState } from "react";
import useFeature from '../store/Feature'
import toast from "react-hot-toast";

const RoomModal = () => {
  const { createAndJoinRoom } = useFeature()
  const [roomName, setRoomName] = useState("");
  const [roomModal, setRoomModal] = useState(false);

  function validateRoomName(name) {
    // Only allow letters & numbers, at least 1 character
    const regex = /^[a-zA-Z0-9]{6,8}$/;  // 6–12 chars allowed
    return regex.test(name);
  }
  const handleJoin = async () => {
    if (!roomName) return toast.error("room-code is required")
    if (!validateRoomName(roomName)) {
      if(roomName.length > 8 || roomName.length < 6) return toast.error("room-code should be lesser than 8 & greater that 6")
      toast.error("Room-code must be alphanumeric only!");
      return;
    }
    console.log("Creating room:", roomName);

    await createAndJoinRoom(roomName)
    setRoomModal(false);
    setRoomName("");
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded text-white"
        onClick={() => setRoomModal(true)}
      >
        Room
      </button>

      {/* Modal */}
      {roomModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <div className="flex flex-col ">
              <span className="text-gray-600 text-center text-sm mb-1">Enter room name</span>
              <input
                type="text"
                placeholder={
                  "alpha-numeric eg: abc123"
                }
                className="w-full border text-black border-zinc-900 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-900"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}

              />

              <div className="flex justify-between">
                <div className="flex w-full justify-center items-center space-x-2">
                  <button
                    className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-gray-600"
                    onClick={() => setRoomModal(false)}
                  >
                    Cancel
                  </button>

                  {(
                    <button
                      className="px-6 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-500"
                      onClick={handleJoin}
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomModal;
