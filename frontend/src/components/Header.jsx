import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const isAuth = localStorage.getItem("isAuth") === "true";
  const [theme, setTheme] = useState("dark");
  const [Avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/v1/logout");
      if (response.data) {
        localStorage.setItem("isAuth", false);
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const fetchProfileAvatar = async () => {
      if (isAuth){try {
        const response = await axios.get("/api/v1/profile");
        setAvatar(response.data.avatar);
      } catch (error) {
        console.error("Error fetching profile avatar:", error);
      }}
      
    };
    fetchProfileAvatar();
  }, []);

  
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="w-full navbar bg-base-300 rounded-full px-10">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <Link
            to={"/"}
            className={`flex-1 mx-2 font-bold font-mono text-xl ${
              theme === "light" ? "text-black" : "text-white"
            }`}
          >
            JWT
          </Link>
          {isAuth ? (
            <li>
              <Link
                to={"/profile"}
                className={`lg:hidden font-semibold ${
                  theme === "light" ? "text-black" : "text-white"
                }`}
              >
                Profile
              </Link>
            </li>
          ) : (
            <a
              className={`lg:hidden font-semibold ${
                theme === "light" ? "text-black" : "text-white"
              }`}
            >
              Login
            </a>
          )}

          <div className="flex-none hidden lg:block font-semibold">
            <ul className="menu menu-horizontal">
              <li>
                <Link
                  to={"/signup"}
                  className={`${
                    theme === "light" ? "text-black" : "text-white"
                  } ${isAuth ? "hidden" : "block"}`}
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to={"/signin"}
                  className={`${
                    theme === "light" ? "text-black" : "text-white"
                  } ${isAuth ? "hidden" : "block"}`}
                >
                  Login
                </Link>
              </li>
              <li>
                <details className={`dropdown ${isAuth ? "block": "hidden" }`}>
                  <summary className="m-1 btn">
                    <a
                      className={`${
                        theme === "light" ? "text-black" : "text-white"
                      } ${!isAuth ? "hidden" : "block"}`}
                    >
                      <div className="avatar flex-1 justify-center items-center">
                        <div className="rounded-full w-8 h-8">

                        <img src={Avatar ? `http://localhost:3500/images/${Avatar}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgee_ioFQrKoyiV3tnY77MLsPeiD15SGydSQ&s"} alt="User Avatar" />
                                             
                        </div>
                      </div>
                    </a>
                  </summary>
                  <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 items-center border border-white">
                    <li className="my-3 border border-white rounded-lg">
                      <Link to={"/profile"}>Account details</Link>
                    </li>
                    <li>
                      <button
                        className="text-red-600 font-mono border border-white p-2 rounded-lg hover:scale-105"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <label className="swap swap-rotate hover:scale-105 flex-1 justify-center items-center">
                  <input
                    type="checkbox"
                    onChange={toggleTheme}
                    checked={theme === "light"}
                  />
                  <svg
                    className="swap-off fill-current w-5 h-8 text-yellow-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                  </svg>
                  <svg
                    className="swap-on fill-current w-5 h-8 text-slate-700"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10,10,0,1,0,21.64,13Z" />
                  </svg>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 h-full bg-base-200">
          <li>
            <Link to={"/profile"} className="rounded-lg">
              Profile
            </Link>
          </li>
          <li>
            <Link to={"/signin"} className="rounded-lg">
              Login
            </Link>
          </li>
          <li>
            <Link to={"/signup"} className="rounded-lg">
              Register
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
