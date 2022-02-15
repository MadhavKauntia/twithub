import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="twithub__footer">
      <div className="twithub__footer_privacy-terms">
        <a
          href="https://www.privacypolicies.com/live/1081f09c-d747-4113-b9b6-aa2e4cb63e52"
          target="_blank"
          rel="noreferrer"
        >
          Privacy
        </a>
        <a
          href="https://www.termsfeed.com/live/abed6fff-e773-4456-9e1a-99397f667951"
          target="_blank"
          rel="noreferrer"
        >
          Terms
        </a>
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
