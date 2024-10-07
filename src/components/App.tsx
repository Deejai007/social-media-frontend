import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Login from "../pages/Login/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "../pages/Register";
import Verify from "../pages/Verify";
import Home from "../pages/Home";
import ForgotPassword from "pages/ForgotPassword/ForgotPassword";
import PasswordReset from "pages/ForgotPassword/PasswordReset";
import CreateProfile from "pages/CreateProfile";
import TopNav from "components/TopNav";
import SideNav from "components/SideNav";
import Profile from "pages/ProfilePage";
import PostPage from "pages/PostPage";
import Notifications from "./../pages/Notifications";
import Settings from "./../pages/Settings";
import { useEffect } from "react";

const IncludeNav: React.FC = () => (
  <>
    <TopNav />
    <SideNav />
    <div className="app-content md:ml-72 pt-16">
      <Outlet />
    </div>
  </>
);

const App: React.FC = () => {
  // useEffect(() => {
  //   console.log("Hi");
  // }, []);
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

      <Routes>
        <Route element={<IncludeNav />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset/:token" element={<PasswordReset />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
