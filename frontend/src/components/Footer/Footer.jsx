import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="twithub__footer">
      <div className="twithub__footer_privacy-terms">
        <div>Privacy</div>
        <div>Terms</div>
      </div>
      <div className="twithub__footer_project-by">
        <p>
          Project by{" "}
          <a
            style={{ textDecoration: "underline" }}
            href="https://www.madhavkauntia.com"
            target="_blank"
            rel="noreferrer"
          >
            Madhav Kauntia
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
