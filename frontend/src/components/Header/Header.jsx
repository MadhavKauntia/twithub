import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import "./Header.css";

const Header = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [initialsOrLogout, setInitialsOrLogout] = useState(authCtx.initials);
  const onMouseEnterHandler = () => {
    setInitialsOrLogout("Logout");
  };
  const onMouseLeaveHandler = () => {
    setInitialsOrLogout(authCtx.initials);
  };
  const logoutHandler = () => {
    navigate("/login", { replace: true });
    authCtx.logout();
  };

  return (
    <div className="twithub__header">
      <h1>
        <span style={{ color: "#1D9BF0" }}>Twit</span>
        <span style={{ color: "#9EAFBA" }}>Hub</span>
      </h1>
      <div
        className="twithub__header-profile"
        onClick={logoutHandler}
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
      >
        <p>{initialsOrLogout || authCtx.initials}</p>
      </div>
    </div>
  );
};

export default Header;
