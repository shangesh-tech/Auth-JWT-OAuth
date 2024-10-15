import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [Success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    avatar: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/v1/profile");
        setProfile(response.data);
        // Populate form data with profile details
        setFormData({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          avatar: null,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, "4000")
      const data = {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
      };

      const response = await axios.put("/api/v1/profile", data);
      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className=" mx-10 my-20">
      {Success ? (
        
        <div role="alert" className=" alert alert-success fixed shadow-lg z-50 w-3/12 top-20 right-4 ">
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
          <span>Succesfully Updated Your Profile!</span>
        
        </div>
      ) : (
        ""
      )}
      <div className="overflow-hidden shadow rounded-lg border text-white">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-red-600">
            Update User Profile
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <form onSubmit={handleSubmit}>
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="Enter your full name"
                  />
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="Enter your email address"
                  />
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <p>{formData.role}</p>
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
                <dt className="text-sm font-medium text-gray-500">Avatar</dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <FileUploader />
                </dd>
              </div>
            </dl>

            <div className=" flex flex-col me-8 justify-end items-end px-4 py-5 sm:px-6">
              <button
                type="submit"
                className="btn btn-primary  me-10 "
                
              >
                Save
              </button>
              <p className="font-mono mt-4">
                Before Save,Please Upload the Avatar{" "}
              </p>
            </div>
          </form>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
