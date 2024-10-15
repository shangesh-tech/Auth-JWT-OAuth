import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const handleSuccess = async (response) => {
    try {
      
      const { clientId, credential } = response;
      
      const { data } = await axios.post("/api/v1/google/auth", {
        clientId,
        credential
      });
       

      if (data.message=='Google login successful') {
        
        localStorage.setItem("isAuth", true);
        navigate("/");
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleError = (error) => {
    console.error("Login failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId="10980931853-nea3pd008voqjoaer9ptvv29a766e8qc.apps.googleusercontent.com">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
