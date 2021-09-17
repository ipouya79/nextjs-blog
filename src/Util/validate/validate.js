import validator from "validator";

const validate = ({ inputValue, validationType, opt = undefined }) => {
  if (validationType === "isMobilePhone") {
    return validator[validationType](inputValue, [opt]);
  } else if (validationType === "isEqual") {
    return inputValue === opt.password;
  } else if (validationType === "isEmpty") {
    return validator.isLength(inputValue, 6, 6);
  } else {
    return validator[validationType](inputValue, opt);
  }
};

export default validate;
