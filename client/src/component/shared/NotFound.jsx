import React from "react";
import Lottie from "lottie-react";
import { Link } from "react-router";
// Option A: If you downloaded a JSON file
import animationData from "../../assets/404-error-animation.json";

const NotFound = () => {
  return (
    <div style={containerStyle}>
      <div style={{ width: "300px", height: "300px" }}>
        {/* Option A: Using local JSON */}
        <Lottie animationData={animationData} loop={true} />

        {/* Option B: Using a direct URL instead (no import needed) */}
        {/* <Lottie animationData={require('../assets/404.json')} loop={true} /> */}
      </div>
      <h1 className="font-bold text-5xl mb-5" style={{ marginTop: "20px" }}>Oops! Page Not Found</h1>
      <p className="font-bold text-xl">The wisdom you are looking for isn't here.</p>
      <Link to="/" style={buttonStyle}>
        Back to Home
      </Link>
    </div>
  );
};

// Simple inline styles for demonstration
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  textAlign: "center",
};

const buttonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  backgroundColor: "#4F46E5",
  color: "white",
  textDecoration: "none",
  borderRadius: "8px",
};

export default NotFound;
