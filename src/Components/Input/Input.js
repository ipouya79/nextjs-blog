import React from "react";
const Input = ({
  inputType,
  inputValue,
  inputPlaceHolder,
  inputName,
  inputId,
  setOnBlur,
  setInputValue,
  inputClass,
}) => {
  const inputOnChange = (e) => {
    setInputValue(e.target.value);
  };

  const inputOnBlur = () => {
    setOnBlur(true);
  };

  return (
    <input
      type={inputType}
      value={inputValue}
      placeholder={inputPlaceHolder}
      name={inputName}
      id={inputId}
      onBlur={inputOnBlur}
      onChange={inputOnChange}
      className={inputClass}
    />
  );
};

export default React.memo(Input);
