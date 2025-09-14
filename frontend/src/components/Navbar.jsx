import React from 'react'
import RoomJoin from './RoomJoin'
import useFeatures from '../store/Feature'

const Navbar = () => {
  const { username, userId, leaveRoom, roomId } = useFeatures()
  return (
    <nav className="w-full bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        MyApp
      </div>

      <div className="flex items-center space-x-4">
        {
          roomId && <button
            onClick={leaveRoom}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
            leaveRoom
          </button>
        }
        <span className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
          {username}
        </span>
        <RoomJoin />
      </div>
    </nav>

  )
}

export default Navbar