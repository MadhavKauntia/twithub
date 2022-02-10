import React, { useState } from "react";
import firebase from "../config/firebase-config";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();

const AuthContext = React.createContext({
  token: "",
  secret: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const [secret, setSecret] = useState(null);

  const userIsLoggedIn = !!token && !!secret;

  const loginHandler = (token, secret) => {
    setToken(token);
    setSecret(secret);
  };

  const logoutHandler = () => {
    setToken(null);
    setSecret(null);
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const contextValue = {
    token: token,
    secret: secret,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
