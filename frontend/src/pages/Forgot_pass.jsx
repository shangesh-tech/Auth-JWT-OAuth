import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Forgot_pass = () => {
  const [email, setEmail] = useState("");
  const [Success, setSuccess] = useState();
  const handler = async () => {
    setSuccess(true);
    const response = await axios.post("/api/v1/forgot-password", { email });

    setTimeout(() => {
      setSuccess(false);
    }, "4000");
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
          <span>Password Reset Link Send Successfully!</span>
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-col gap-y-10">
        <p>
          Enter the email address associated with your account and we'll send
          you a link to reset your password.
        </p>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button
          onClick={() => {
            handler();
          }}
          className="btn btn-primary mx-6"
        >
          Continue{" "}
        </button>
      </div>
      <div className="mt-4">
        Don't have an account?{" "}
        <Link className="text-sky-600 " to={"/signup"}>
          Signup
        </Link>
      </div>
    </section>
  );
};

export default Forgot_pass;
