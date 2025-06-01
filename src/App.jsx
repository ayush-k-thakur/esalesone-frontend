import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './components/Homepage'
import CheckoutPage from './components/Checkoutpage'
import Navbar from './components/Navbar'
import ThankyouPage from './components/ThankyouPage'

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/thankyou" element={<ThankyouPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
