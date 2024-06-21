import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Login from '../pages/Login/Login'
import SignUp from './../pages/Login/Register'
function App() {
  return (
    <div className="">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
