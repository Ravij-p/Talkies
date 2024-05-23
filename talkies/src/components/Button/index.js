import React from "react";
const Button = ({ label = "", className = "", onChange = () => null }) => {
  return (
    <button
      className={`text-white font-bold py-2 px-4 rounded ${className}`}
      onClick={onChange}
    >
      {label}
    </button>
  );
};
export default Button;
