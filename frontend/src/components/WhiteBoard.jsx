import React from 'react'
import ToolBar from './ToolBar'
import useFeatures from '../store/Feature'
import DrawingCanvas from './DrawingCanvas'

const WhiteBoard = () => {
  const { roomName, roomUsers, userId } = useFeatures();
  if (!roomName && !roomUsers.includes(userId)) return <div className='flex h-[calc(100vh-64px)] justify-center items-center text-2xl'>start by creating or joining a room</div>
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">

      {/* Middle section */}
      <div className="flex-1 bg-gray-50 p-4 overflow-auto">
        <DrawingCanvas />
      </div>

      {/* Right sidebar */}
      <span className="absolute top-23 right-5 bg-green-500 text-white text-sm px-3 py-1 rounded-full shadow-md">
      {roomUsers.length} Online
    </span>
    </div>


  )
}

export default WhiteBoard