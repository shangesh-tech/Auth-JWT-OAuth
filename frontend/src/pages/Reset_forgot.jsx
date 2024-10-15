import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Reset_forgot = () => {
  let { token } = useParams();
  const [newPassword, setPass] = useState("");
  const [Success, setSuccess] = useState();
  const navigate = useNavigate();
  const handler = async () => {
    setSuccess(true);
    console.log(token)
    const response = await axios.post(`/api/v1/reset-password/${token}`, { newPassword});
    console.log(response.data);
    setTimeout(() => {
      setSuccess(false);
    }, "4000");
    navigate("/signin")
  };
  return (
    <section className="mx-96 mt-20 ">
      {Success ? (
        <div
          role="alert"
          className=" alert alert-success fixed shadow-lg z-50 w-3/12 top-20 right-4 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Your Password Has been Updated!</span>
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-col gap-y-10">
        <p className="text-red-600">Enter the New Password</p>
        <input
                  autoComplete="current-password"
                  className="input input-bordered w-full"
                  id="password"
                  name="password"
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setPass(e.target.value)}
                />
        <button
          onClick={() => {
            handler();
          }}
          className="btn btn-primary mx-6"
        >
          Update the Password
        </button>
      </div>
    </section>
  );
};

export default Reset_forgot;
