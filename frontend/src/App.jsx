import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import WhiteBoard from './components/WhiteBoard'
import { useEffect } from 'react';
import useFeatures from './store/Feature';

const App = () => {
  const { userId, roomId, newSocket, initUser, connectSocket, disconnectSocket, joinRoom } = useFeatures();
  useEffect(() => {
    connectSocket()
    return () => {
      disconnectSocket()
    }
  }, [])
  
  useEffect(() => {
    initUser(); // initialize user if not exists
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 h-[calc(100vh-64px)]">
        <WhiteBoard />
      </div>
      <Toaster />
    </>
  )
}

export default App