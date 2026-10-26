import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import HomeOld from './pages/home/HomeOld'
import Admin from './pages/admin/Admin'
import AdminCv from './pages/admin/AdminCv'
import CV from './pages/cv/CV'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home-old" element={<HomeOld />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/resume" element={<Navigate to="/cv" replace />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/cv" element={<AdminCv />} />
      </Routes>
    </BrowserRouter>
  )
}
