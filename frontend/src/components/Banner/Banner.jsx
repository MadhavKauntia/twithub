import React from "react";
import "./Banner.css";

const Banner = ({
  bannerImg,
  bannerImgAlt,
  description,
  inputRef,
  inputLabel,
  submitHandler,
}) => {
  return (
    <div className="twithub__banner section__margin">
      <div className="twithub__banner-image">
        <img src={bannerImg} alt={bannerImgAlt} />
      </div>
      <div className="twitter__banner-content">
        {description}
        <div className="twitter__banner-content_actions">
          <input placeholder={inputLabel} ref={inputRef} />
          <button type="button" onClick={submitHandler}>
            Set Banner
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
