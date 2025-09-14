import React, { useState } from "react";
import useFeature from '../store/Feature'
import toast from "react-hot-toast";

const RoomModal = () => {
  const { createAndJoinRoom } = useFeature()
  const [roomId, setRoomId] = useState("");
  const [roomModal, setRoomModal] = useState(false);
  const [mode, setMode] = useState("create"); // default is create room



  const handleJoin = async () => {
    if (!roomId) return toast.error("roomId is required")
    console.log("Joining room:", roomId);

    const body = {
      roomId,
      creating: false, 
    };

    await createAndJoinRoom(body); setRoomModal(false);
    setMode("create");
    setRoomId("");
  };

  const handleCreate = async () => {
    if (!roomId) return toast.error("roomId is required")

    console.log("Creating room:", roomId);
    const body = {
      roomId,
      creating: true
    }
    await createAndJoinRoom(body)
    setRoomModal(false);
    setMode("create");
    setRoomId("");
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
            {/* Mode = Create / Join form */}
            <div className="flex flex-col">

              <button
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mb-3"
                onClick={() =>
                  setMode(mode === "create" ? "join" : "create")
                }
              >
                {mode === "create" ? "Switch to Join" : "Switch to Create"}
              </button>

              <input
                type="text"
                placeholder={
                  mode === "create" ? "Enter New Room Name" : "Enter Room ID"
                }
                className="w-full border text-black border-zinc-900 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-900"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}

              />

              <div className="flex justify-between">
                {/* Toggle between create/join */}


                <div className="flex w-full justify-center items-center space-x-2">
                  <button
                    className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-gray-600"
                    onClick={() => setRoomModal(false)}
                  >
                    Cancel
                  </button>

                  {mode === "create" && (
                    <button
                      className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-500"
                      onClick={handleCreate}
                    >
                      Create
                    </button>
                  )}

                  {mode === "join" && (
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
