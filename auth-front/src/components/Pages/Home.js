import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="homeDiv">
      <p>Welcome To Website.</p>
      <Link to="/register">Register</Link>
      <br />
      <Link to="/login">Login</Link>
    </div>
  );
}

export default Home;
