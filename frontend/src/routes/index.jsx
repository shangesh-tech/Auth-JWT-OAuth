import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import Signup from "../pages/Signup";
import Forgot_pass from "../pages/Forgot_pass";
import Reset_forgot from "../pages/Reset_forgot";
import ProtectedRoute from "../components/ProtectedRoute";
import Profile from "../pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        ),
      },
      {
        path: "forgot-password",
        element: <Forgot_pass />,
      },
      {
        path:"reset-password/:token",
        element:<Reset_forgot/>
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
]);

export default router;
