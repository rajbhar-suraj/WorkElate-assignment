import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import WhiteBoard from './components/WhiteBoard'
import { useEffect } from 'react';
import useFeatures from './store/Feature';

const App = () => {
  const { userId, initUser, connectSocket } = useFeatures();


  useEffect(() => {
    initUser(); // initialize user if not exists
  }, []);
  useEffect(() => {
    if (userId) {
      connectSocket(); 
    }
  }, [userId]);
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