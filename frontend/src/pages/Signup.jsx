
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import axios from 'axios';
import GoogleLoginButton from "../components/GoogleLoginButton";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      
      const response = await axios.post(`api/v1/register`, { name, email, password });
      if (response.data) {
        navigate('/signin');
      }
    } catch (err) {
      setError(err.response.data.error || 'Registration failed');
    }
  };

  return (
    <div className="flex pb-6 h-screen items-center justify-center mt-10">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Register for a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
              to="/signin"
            >
              Sign in
            </Link>
          </p>
        </div>
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 dark:ring-1 dark:ring-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 gap-3 mb-6">
                  <a
                    type="button"
                    className="btn btn-outline bg-white"
                    
                  >
                    <GoogleLoginButton/>
                  </a>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="name">
                Name
              </label>
              <div className="mt-1">
                <input
                  autoComplete="name"
                  className="input input-bordered w-full"
                  id="name"
                  name="name"
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
                Password
              </label>
              <div className="mt-1">
                <input
                  autoComplete="new-password"
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
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  autoComplete="new-password"
                  className="input input-bordered w-full"
                  id="confirm-password"
                  name="confirm-password"
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button className="btn btn-primary" type="submit">
                Register
              </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
