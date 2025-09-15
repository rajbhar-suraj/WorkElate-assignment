import React from 'react'
import RoomJoin from './RoomJoin'
import useFeatures from '../store/Feature'

const Navbar = () => {
  const { username, leaveRoom, roomName } = useFeatures()
  return (
    <nav className="w-full h-16 bg-gray-800 text-white px-6 flex justify-between items-center">
      <div className="text-xl font-bold">
        MyApp
      </div>

      <div className="flex items-center space-x-4">

        <span className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
          {username}
        </span>
        {
          roomName && <button
            onClick={leaveRoom}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
            leaveRoom
          </button>
        }
        {
          !roomName && <RoomJoin />
        }
      </div>
    </nav>

  )
}

export default Navbar