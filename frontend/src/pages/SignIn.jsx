import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import GoogleLoginButton from "../components/GoogleLoginButton";


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/login", { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem("isAuth", true);
        navigate("/");
      }
    } catch (err) {
      setError(err.response.data.error || "Login failed");
    }
  };


  return (
    <>
      <div className="flex h-screen items-center justify-center ">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight ">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Or{" "}
              <Link
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
                to="/signup"
              >
                register for a new account
              </Link>
            </p>
          </div>
          <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 dark:ring-1 dark:ring-gray-700">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <div className="grid grid-cols-1 gap-3 mb-6">
                  <a
                    type="button"
                    className="btn btn-outline bg-white"
                    
                  >
                    <GoogleLoginButton/>
                  </a>
                  
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  htmlFor="email"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    autoComplete="email"
                    className="input input-bordered w-full"
                    id="email"
                    name="email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    autoComplete="current-password"
                    className="input input-bordered w-full"
                    id="password"
                    name="password"
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
                    to="/forgot-password"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div>
                <button className="btn btn-primary w-full" type="submit">
                  Sign in
                </button>
              </div>
              {error && <div className="mt-4 text-red-500">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
