import React, { useState } from "react";

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
