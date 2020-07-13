import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import axios from "axios";
// importing styling components
import "./style.css";
import Home from "./components/Pages/Home";
import Login from "./components/Pages/Login";
import Register from "./components/Pages/Register";
import Error from "./components/Pages/Error";

// importing context stuff
import UserContext from "./components/context/UserContext";
import UserDashPage from "./components/Pages/PrivatePages/UserDashPage";

function App() {
  // defining useHistory

  // defining states
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  useEffect(() => {
    const getUserOnLoad = async () => {
      let token = localStorage.getItem("auth-token");

      // if the localstorage is null
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }

      const tokenResponse = await axios.post(
        "http://localhost:5000/user/isTokenValid",
        null,
        { headers: { "x-auth-token": token } }
      );

      const userResponse = await axios.get("http://localhost:5000/user/", {
        headers: { "x-auth-token": token },
      });
      console.log(userResponse.data);
      setUserData({
        token: tokenResponse.data,
        user: userResponse.data,
      });
    };
    getUserOnLoad();
  }, []);

  return (
    <div>
      <Router>
        <UserContext.Provider value={{ userData, setUserData }}>
          <Header />
          <Switch>
            <Route path="/login" component={Login} exact />
            <Route path="/register" component={Register} exact />
            <Route path="/" component={Home} exact />
            <Route path="/user-dashboard" component={UserDashPage} exact />
            <Route path="/*" component={Error} />
          </Switch>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
