import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import WhiteBoard from './components/WhiteBoard'
import { useEffect } from 'react';
import useFeatures from './store/Feature';

const App = () => {
  const { username, userId, initUser, connectSocket } = useFeatures();


  useEffect(() => {
    initUser(); // initialize user if not exists
  }, []);
  useEffect(() => {
    if (userId) {
      connectSocket(); // only connect after userId exists
    }
  }, [userId]);
  return (
    <>
      <Navbar />
      <div className='bg-gray-100 h-screen'>
        <WhiteBoard />
      </div>
      <Toaster />
    </>
  )
}

export default App