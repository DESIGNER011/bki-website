import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navigation from './components/Navigation'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Courses from './pages/Courses'
import { CourseKids, CourseTeens, CourseAdults } from './pages/CoursePages'
import BeltSystem from './pages/BeltSystem'
import Achievements from './pages/Achievements'
import Contact from './pages/Contact'
import TrialBooking from './pages/TrialBooking'
import Admin from './pages/Admin'

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <ScrollToTop />
        <Navigation />
        <main id="app-container">
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/about"          element={<AboutUs />} />
            <Route path="/courses"        element={<Courses />} />
            <Route path="/courses/kids"   element={<CourseKids />} />
            <Route path="/courses/teens"  element={<CourseTeens />} />
            <Route path="/courses/adults" element={<CourseAdults />} />
            <Route path="/belts"          element={<BeltSystem />} />
            <Route path="/achievements"   element={<Achievements />} />
            <Route path="/contact"        element={<Contact />} />
            <Route path="/trial"          element={<TrialBooking />} />
            <Route path="/admin"          element={<Admin />} />
            <Route path="*"              element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </HashRouter>
    </AuthProvider>
  )
}
