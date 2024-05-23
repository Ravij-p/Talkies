import React from "react";

const Input = ({
  name = "",
  label = "",
  type = "text",
  placeholder = "",
  className = "",
  value = "",
  onChange = () => null,
  isRequired = true,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          className="block text-grey-700 text-sm font-bold mb-2 font-sans"
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <input
        className={`shadow appearance-none border w-full py-2 px-3 text-gray-700 font-sans leading-tight focus:outline-none focus:shadow-outline ${className}`}
        id={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={isRequired}
      />
    </div>
  );
};

export default Input;
