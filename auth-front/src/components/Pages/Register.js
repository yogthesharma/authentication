import React, { useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import axios from "axios";

function Register() {
  // setting up the history

  const history = useHistory();
  // getting the context of the values

  const { userData, setUserData } = useContext(UserContext);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [gender, setGender] = useState("Male");
  const [password, setPassword] = useState();
  const [checkPassword, setCheckPassword] = useState();

  // sate for checking field
  const [temp, setTemp] = useState();

  // function for submitting the form
  const submit = async (e) => {
    e.preventDefault();
    const user = { name, email, gender, password, checkPassword };
    console.log(user);
    await axios
      .post("http://localhost:5000/user/register", user)
      .catch((error) => {
        setTemp(error.response.data);
      });
    const loginUser = await axios.post("http://localhost:5000/user/login", {
      email,
      password,
    });
    setUserData({ token: loginUser.data.token, user: loginUser.data.user });
    localStorage.setItem("auth-token", loginUser.data.token);
    history.push("/user-dashboard");
  };

  return (
    <div className="registerDiv">
      <form onSubmit={submit}>
        <div className="warningDiv">
          {temp ? <h5 className="warning">{temp.msg}</h5> : null}
        </div>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
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
        <input
          type="password"
          placeholder="Conform Password"
          onChange={(e) => setCheckPassword(e.target.value)}
        />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
          <option value="Rather Not To Say">Rather Not To Say</option>
        </select>
        <input type="submit" value="Sign Up" />
    
        <Link to="/login">Login Instead</Link>
      </form>
    </div>
  );
}

export default Register;
