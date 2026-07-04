import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './Auth/SignUp'
import Layout from './Page/Layout'
import NotFound from './Page/NotFound'
import UserPage from './Student/UserPage'
import OwnerPage from './Owner/OwnerPage'
import AuthGate from './Auth/AuthGate'
import StoreListPage from './Student/StoreList'
import Schedule from './Student/Schedule'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/" element={<AuthGate/>} />
        <Route path="/signup" element={<SignUp />} />

        {/* student */}
        <Route path="/mypage" element={<Layout content={<UserPage />} />} />
        <Route path="/reserve" element={<Layout content={<StoreListPage />} />} />
        <Route path="/reserve/:storeID" element={<Layout content={<Schedule />} />} />

        {/* owner */}
        <Route path="/owner" element={<Layout content={<OwnerPage />} />} />

        {/* fallback */}
        <Route path="*" element={<Layout content={<NotFound />} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
