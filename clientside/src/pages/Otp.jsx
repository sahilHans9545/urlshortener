import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { backendUrl } from "../../backendUrl";

const Otp = ({ email, username, password }) => {
  const [inputOtp, setInputOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const verifyAccount = async (e) => {
    const inputOtp = document.querySelectorAll(".otpInput");
    try {
      e.preventDefault();
      setLoading(true);
      console.log(inputOtp);
      let otp = "";
      inputOtp.forEach((element) => {
        otp += element.value;
      });
      console.log(otp);
      setInputOtp(otp);
      const response = await axios.post(`${backendUrl}/user/verifyOtp`, {
        otp,
        email,
        username,
        password,
      });
      console.log(response);
      toast.success(response?.data?.message);
      navigate("/");
    } catch (error) {
      inputOtp.forEach((element) => {
        element.value = "";
      });
      toast.error(error.response?.data?.message);
    }
    setLoading(false);
  };
  const resendOtp = async () => {
    try {
      const response = await axios.post(`${backendUrl}/user/resendOtp`, {
        email,
      });
      console.log(response.data);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden  py-12">
        <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-8">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="font-semibold text-3xl">
                <p>Email Verification</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400">
                <p>
                  We have sent a code to your Email{" "}
                  <span className="text-blue-400">{email}</span>
                </p>
              </div>
            </div>

            <div>
              <form action="" method="post" onSubmit={verifyAccount}>
                <div className="flex flex-col space-y-8">
                  <div className="flex flex-row items-center justify-between mx-auto w-full ">
                    <div className="w-16 h-16 ">
                      <input
                        className="otpInput w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-400 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        name=""
                        id=""
                      />
                    </div>
                    <div className="w-16 h-16 ">
                      <input
                        className="otpInput w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-400 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        name=""
                        id=""
                      />
                    </div>
                    <div className="w-16 h-16 ">
                      <input
                        className="otpInput w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-400 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        name=""
                        id=""
                      />
                    </div>
                    <div className="w-16 h-16 ">
                      <input
                        className="otpInput w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-400 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        name=""
                        id=""
                      />
                    </div>
                    <div className="w-16 h-16 ">
                      <input
                        className="otpInput w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-400 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        name=""
                        id=""
                      />
                    </div>
                    <div className="w-16 h-16 ">
                      <input
                        className="otpInput w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-400 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        name=""
                        id=""
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-5">
                    <div>
                      {loading ? (
                        <Oval
                          visible={true}
                          height="28"
                          width="28"
                          color="#fff"
                          ariaLabel="oval-loading"
                          wrapperStyle={{}}
                          wrapperClass="flex justify-center"
                        />
                      ) : (
                        <button className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm">
                          Verify Account
                        </button>
                      )}
                    </div>

                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                      <p>Didn't recieve code?</p>{" "}
                      <span
                        className="flex flex-row items-center text-blue-600 cursor-pointer"
                        onClick={resendOtp}
                      >
                        Resend
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
