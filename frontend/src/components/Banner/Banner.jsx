import React from "react";
import "./Banner.css";

const Banner = ({
  bannerImg,
  bannerImgAlt,
  description,
  inputRefs,
  inputLabels,
  error,
  setError,
  success,
  setSuccess,
  submitHandler,
}) => {
  let count = -1;
  return (
    <div className="twithub__banner section__margin">
      <div className="twithub__banner-image">
        <img src={bannerImg} alt={bannerImgAlt} />
      </div>
      <div className="twitter__banner-content">
        {description}
        <div className="twitter__banner-content_actions">
          {inputLabels.map((inputLabel) => {
            ++count;
            return (
              <input
                placeholder={inputLabel}
                ref={inputRefs[count]}
                onChange={() => {
                  setError(null);
                  setSuccess(null);
                }}
              />
            );
          })}
          <button type="button" onClick={submitHandler}>
            Set Banner
          </button>
        </div>
        {error && (
          <p className="twithub__banner-error shake-horizontal">{error}</p>
        )}
        {success && (
          <p className="twithub__banner-success jello-horizontal">{success}</p>
        )}
      </div>
    </div>
  );
};

export default Banner;
