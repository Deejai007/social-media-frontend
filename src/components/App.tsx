import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "../pages/Login/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "../pages/Register";
import Verify from "../pages/Verify";
import Home from "../pages/Home";
import ForgotPassword from "pages/ForgotPassword/ForgotPassword";
import PasswordReset from "pages/ForgotPassword/PasswordReset";
function App() {
  return (
    <div className="">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        // hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        // pauseOnFocusLoss
        // draggable
        // pauseOnHover={false}

        // theme="light"
      ></ToastContainer>

      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/home" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset/:token" element={<PasswordReset />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
