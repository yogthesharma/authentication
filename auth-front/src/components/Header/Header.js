import React, { useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import UserContext from "../context/UserContext";

function Header() {
  const history = useHistory();

  // using context
  const { userData, setUserData } = useContext(UserContext);

  const register = () => {
    history.push("/register");
  };

  const login = () => {
    history.push("/login");
  };

  const logout = () => {
    setUserData({ token: undefined, user: undefined });
    localStorage.setItem("auth-token", "");
    history.push("/login");
  };
  return (
    <div className="header">
      <h3>
        <Link to="/">LogoName</Link>
      </h3>
      <div className="buttonsClass">
        {userData.user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <>
            <button onClick={register}>Register</button>
            <button onClick={login}>Login</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
