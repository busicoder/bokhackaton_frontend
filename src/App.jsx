import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Auth/Login'
import SignUp from './Auth/SignUp'
import Layout from './Page/Layout'
import NotFound from './Page/NotFound'
import UserPage from './Student/UserPage'
import OwnerPage from './Owner/OwnerPage'
import ReservationPage from './Student/Reserve'
import AuthGate from './Auth/AuthGate'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/" element={<AuthGate/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* student */}
        <Route path="/mypage" element={<Layout content={<UserPage />} />} />
        <Route path="/reserve" element={<Layout content={<ReservationPage />} />} />

        {/* owner */}
        <Route path="/owner" element={<Layout content={<OwnerPage />} />} />

        {/* fallback */}
        <Route path="*" element={<Layout content={<NotFound />} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
