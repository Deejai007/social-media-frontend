import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "redux/store/store";
import { ThreeDots } from "react-loader-spinner";
import { verify, sendOtp } from "../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

interface Props {}

const Verify: React.FC<Props> = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (!user.user) {
      navigate("/login", { replace: true });
      return;
    }
    if (!user.user.email) {
      navigate("/login", { replace: true });
    }
    if (user.user.verified) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);
  const loading = useSelector((state: RootState) => state.user.loading);
  const dispatch: AppDispatch = useDispatch();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [showOtpForm, setShowOtpForm] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleSendOtp = async () => {
    if (!user.user || !user.user.email) {
      toast.error("User not logged in or email missing");
      navigate("/login", { replace: true });
      return;
    }
    let email: string = user.user.email;

    const result = await dispatch(sendOtp(email));
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
      setShowOtpForm(true);
    } else {
      console.log(result.payload.message);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = event.target.value;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { key } = event;
    console.log(event);

    if (key === "Backspace") {
      if (index > 0) {
        if (!otp[index]) {
          inputRefs.current[index - 1]?.focus();
        } else {
          setOtp((prevOtp) => {
            const newOtp = [...prevOtp];
            newOtp[index] = "";
            return newOtp;
          });
        }
      } else {
        setOtp((prevOtp) => {
          const newOtp = [...prevOtp];
          newOtp[index] = "";
          return newOtp;
        });
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user.user || !user.user.email) {
      toast.error("User not logged in or email missing");
      navigate("/login", { replace: true });
      return;
    }
    const otpValue = otp.join("");
    console.log("OTP Submitted:", otpValue);
    const result = await dispatch(
      verify({ email: user.user.email, otp: otpValue }),
    );
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
      navigate("/create-profile");
    } else {
      console.log(result.payload.message);
    }
  };

  if (!user.user || !user.user.email) {
    // Prevent rendering if user is not logged in or email is missing
    return null;
  }

  return (
    <>
      <main className="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
          <div className="flex justify-center">
            <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
              <header className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Email Verification</h1>
                <p className="text-[15px] text-slate-500">
                  Before proceeding further, you need to verify your email id{" "}
                  <span className="font-semibold">{user.user.email}</span>
                </p>
              </header>
              {!showOtpForm ? (
                <button
                  onClick={handleSendOtp}
                  className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-700 transition-colors duration-150"
                >
                  {loading ? (
                    <ThreeDots
                      visible={true}
                      height="24"
                      width="36"
                      color="white"
                      radius="8"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  ) : (
                    <span>Send OTP</span>
                  )}
                </button>
              ) : (
                <form id="otp-form" onSubmit={handleSubmit}>
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    {otp.map((value, index) => (
                      <input
                        key={index}
                        type="text"
                        required
                        maxLength={1}
                        value={value}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={(el) => (inputRefs.current[index] = el)}
                        className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        pattern="\d*"
                      />
                    ))}
                  </div>
                  <div className="max-w-[260px] mx-auto mt-4">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
                    >
                      {loading ? (
                        <ThreeDots
                          visible={true}
                          height="24"
                          width="36"
                          color="white"
                          radius="8"
                          ariaLabel="three-dots-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      ) : (
                        <span>Verify Account</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
              <div className="text-sm text-slate-500 mt-4">
                Didn't receive code?{" "}
                <a
                  className="font-medium text-indigo-500 hover:text-indigo-600"
                  href="#0"
                >
                  Resend
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default connect(null, { sendOtp, verify })(Verify);
