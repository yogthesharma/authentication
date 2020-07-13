import React, { useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import axios from "axios";

function Login() {
  const history = useHistory();
  // getting the context of the values

  const { setUserData } = useContext(UserContext);

  // native states of the components
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  // temprorary state for catching errors
  const [temp, setTemp] = useState();

  // submit form function
  const submit = async (e) => {
    e.preventDefault();

    // const loginUser = undefined;
    const loginUser = await axios
      .post("http://localhost:5000/user/login", {
        email,
        password,
      })
      .catch((err) => setTemp(err.response.data));

    if (loginUser) {
      setUserData({ token: loginUser.data.token, user: loginUser.data.user });
      localStorage.setItem("auth-token", loginUser.data.token);
      history.push("/user-dashboard");
    }
  };

  return (
    <div className="loginDiv">
      <form onSubmit={submit}>
        <div class="warningDiv">
          {temp ? <h5 className="warning">{temp.msg}</h5> : null}
        </div>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" value="Login" />

        <Link to="/register">Register Instead</Link>
      </form>
    </div>
  );
}

export default Login;
