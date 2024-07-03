import { Link, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "redux/store/store";
import { forgotResetPassword } from "../../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

interface Params {
  token: string;
  [key: string]: string;
}

const PasswordReset: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { token = "" } = useParams<Params>();
  console.log(token);

  const [formData, setFormData] = useState<{
    password: string;
    passwordcnf: string;
  }>({
    password: "",
    passwordcnf: "",
  });
  const [sameError, setSameError] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (formData.password === formData.passwordcnf) {
      setSameError(false);
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    if (formData.password !== formData.passwordcnf) {
      setSameError(true);
      return;
    }
    const result = await dispatch(
      forgotResetPassword({ newPassword: formData.password, token: token }),
    );
    console.log(result);

    if (result.payload.success) {
      console.log(result.payload.message);
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
      navigate("/login");
    } else {
      toast.error(result.payload.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log(result.payload);
    }
  };

  return (
    <div className="h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-4xl mx-auto mt-24">
        <div className="flex flex-col items-center justify-center  p-4 space-y-4 antialiased text-gray-900 bg-gray-100">
          <div className="w-full px-8 max-w-lg space-y-6 bg-white rounded-md py-16">
            <h1 className=" mb-6 text-3xl font-bold font-work text-center">
              Reset your password
            </h1>
            <p className="text-center font-nunito mx-12"> </p>
            <form action="#" className=" w-ful" onSubmit={handleSubmit}>
              <label htmlFor="password" className="font-nunito px-2  ">
                New password
              </label>
              <input
                className="w-full px-4 py-2 border rounded-md 
                font-nunito focus:outline-none focus:ring font-nunito m-3 focus:ring-primary-100"
                type="password"
                name="password"
                required
                placeholder="new password"
                onChange={handleChange}
              />

              <label htmlFor="passwordcnf" className="px-2 font-nunito">
                Re-enter password
              </label>
              <input
                className="w-full px-4 py-2 border rounded-md 
                font-nunito focus:outline-none focus:ring font-nunito m-3 focus:ring-primary-100"
                type="password"
                name="passwordcnf"
                required
                placeholder="re-enter password"
                onChange={handleChange}
              />
              <div className="">
                {sameError && (
                  <p className="text-red-600 px-4 py-2 ">
                    *Passwords Don't match!
                  </p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 font-medium text-center text-white bg-ring-indigo-600 transition-colors duration-200 rounded-md bg-indigo-500 
                  font-nunito hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1"
                >
                  Change password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PasswordReset;
