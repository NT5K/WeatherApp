import React from "react";

interface InputFieldProps {
  // Name of the input field
  name: string;
  // Value of the input field
  value: string;
  // Function to handle input changes
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Placeholder text for the input field
  placeholder: string;
  // Additional class name for the input field
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  value,
  onChange,
  placeholder,
  className,
}) => {
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`form-control ${className}`}
    />
  );
};

export default InputField;