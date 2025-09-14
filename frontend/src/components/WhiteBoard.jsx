import React from 'react'
import ToolBar from './ToolBar'
import useFeatures from '../store/Feature'

const WhiteBoard = () => {
  const { roomId, roomUsers, userId } = useFeatures();
  if (!roomId && !roomUsers.includes(userId)) return <div>start by creating or joining a room</div>
  return (
    <div className=''>
      <div>
        <ToolBar />
      </div>

      WhiteBoard
    </div>
  )
}

export default WhiteBoard