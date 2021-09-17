import { useEffect, useState } from "react";
import Input from "../../../../Components/Input/Input";
import Label from "../../../../Components/Label/Label";
import validate from "../../../../Util/validate/validate";

const FormGroup = ({
  inputType,
  inputValue,
  setInputValue,
  inputPlaceHolder,
  inputId,
  lableContent,
  validationType,
  opt,
  errorMessage,
}) => {
  const [blurController, setBlurController] = useState(false);

  const [inputValidateResult, setInputValidateResult] = useState(null);

  useEffect(() => {
    if (validationType) {
      if (blurController) {
        const validatonResult = validate({ inputValue, validationType, opt });

        if (!inputValue) {
          setBlurController(false);
          setInputValidateResult(null);
          return;
        }

        if (!validatonResult) {
          setInputValidateResult(
            <div
              className="alert alert-danger d-flex align-items-center p-1 invalid-feedback"
              role="alert"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                className="bi bi-exclamation-triangle-fill flex-shrink-0 mx-1"
                viewBox="0 0 16 16"
                role="img"
                aria-label="Warning:"
              >
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
              <div>{errorMessage}</div>
            </div>
          );
        } else {
          setInputValidateResult(null);
        }
      } else return;
    } else return;
  }, [inputValue, blurController]);

  return (
    <div className="col-md-12 my-3">
      <Label
        labelFor={inputId}
        lableContent={lableContent}
        lableClass="form-label"
      />
      <Input
        inputType={inputType}
        inputValue={inputValue}
        inputPlaceHolder={inputPlaceHolder}
        inputId={inputId}
        inputClass="form-control mb-2"
        setOnBlur={setBlurController}
        setInputValue={setInputValue}
      />
      {inputValidateResult}
    </div>
  );
};

export default FormGroup;
