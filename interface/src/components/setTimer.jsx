import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
// Import your logout action

const TokenExpiry = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [token, setToken] = useState(Cookie.get("User")); // Replace with your token retrieval logic

  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    // Function to check if the token has expired
    const isTokenExpired = (token) => {
      try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = tokenPayload.exp * 1000; // Convert seconds to milliseconds
        const currentTime = new Date().getTime();
        return expirationTime <= currentTime;
      } catch (error) {
        console.error("Error parsing JWT token:", error);
        return true; // Return true to force logout if there's an error in token parsing
      }
    };

    // Function to handle logout when the token expires
    const handleLogoutOnTokenExpiration = () => {
      if (isTokenExpired(token)) {
        dispatch({ type: "LOGOUT" });
        Cookie.remove("User"); 
        Navigate("/")
        // Replace with your token removal logic
      }
    };

    // Start the session timeout timer when the component mounts or when the token changes
    const sessionTimeoutTimer = setInterval(() => {
      const currentTime = new Date().getTime();
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = tokenPayload.exp * 1000;
      const remainingTime = Math.max(0, expirationTime - currentTime);
      setRemainingTime(remainingTime);
      if (remainingTime === 0) {
        handleLogoutOnTokenExpiration();
        clearInterval(sessionTimeoutTimer);
      }
    }, 1000); // Check every 1 second (adjust as needed)

    // Clear the timer when the component unmounts or when the token changes
    return () => {
      clearInterval(sessionTimeoutTimer);
    };
  }, [dispatch, token]);

  // Function to format time in minutes and seconds
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // ... Your other component code
  // Display the remaining time in your UI
  return (
    <div>
      {remainingTime !== null ? (
        <p>Time remaining: {formatTime(remainingTime)}</p>
      ) : null}
      {/* Your other UI elements */}
    </div>
  );
};

export default TokenExpiry;
