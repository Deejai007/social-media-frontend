import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "redux/store/store";
import { forgotPassword } from "../../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

const ForgotPassword: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email);
    const result = await dispatch(forgotPassword(email));
    if (result.payload.success) {
      console.log(result.payload.message);
      setIsSent(true);
      toast.success(result.payload.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.info(result.payload.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log(result.payload.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-4xl mx-auto mt-24">
        <div className="flex flex-col items-center justify-center  p-4 space-y-4 antialiased text-gray-900 bg-gray-100">
          <div className="w-full px-8 max-w-lg space-y-6 bg-white rounded-md py-16">
            <h1 className=" mb-6 text-3xl font-bold font-work text-center">
              Don't worry
            </h1>
            <p className="text-center font-nunito mx-12">
              We are here to help you to recover your password. Enter the email
              address and we'll send you instructions to reset your password.
            </p>
            <form
              action="#"
              className="space-y-6 w-ful"
              onSubmit={handleSubmit}
            >
              <input
                className="w-full px-4 py-2 border rounded-md 
                font-nunito focus:outline-none focus:ring focus:ring-primary-100"
                type="email"
                name="email"
                required
                placeholder="Email address"
                onChange={handleChange}
              />
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 font-medium text-center text-white bg-ring-indigo-600 transition-colors duration-200 rounded-md bg-indigo-500 
                  font-nunito hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1"
                >
                  Send
                </button>
              </div>
            </form>
            {isSent && (
              <div className="flex justify-center bg-green-100 p-2 rounded-md text-green-900 font-nunito flex-row">
                <p className=" ">
                  Email Has been sent! Check your email for further
                  instructions.
                </p>
              </div>
            )}
            <div className="text-sm text-gray-600 items-center flex justify-between font-nunito ">
              <Link to="/login">
                <p className="text-gray-800 cursor-pointer hover:text-blue-500 inline-flex items-center ml-4">
                  <IoMdArrowRoundBack />
                  Back
                </p>
              </Link>
              <p className="hover:text-blue-500 cursor-pointer font-nunito">
                Need help?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
