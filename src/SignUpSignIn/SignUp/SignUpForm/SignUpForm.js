import { useCallback } from "react";
import Form from "../../../Components/Form/Form";
import SubmitButton from "../../../Components/SubmitButton/SubmitButton";
import FormGroup from "./FormGroup/FormGroup";

const SignUpForm = ({
  formSubmitHandler,
  userData,
  setUserData,
  submitButtonController,
}) => {
  return (
    <Form
      formSubmitHandler={formSubmitHandler}
      formClass="mb-4 needs-validation col-md-6"
    >
      <FormGroup
        inputType="text"
        inputValue={userData.username}
        setInputValue={useCallback(
          (val) =>
            setUserData((prvs) => {
              return { ...prvs, username: val };
            }),
          [userData.username]
        )}
        inputPlaceHolder="example"
        inputId="usernameSignUp"
        lableContent="نام کاربری"
      />
      <FormGroup
        inputType="text"
        inputValue={userData.email}
        setInputValue={useCallback(
          (val) =>
            setUserData((prvs) => {
              return { ...prvs, email: val };
            }),
          [userData.email]
        )}
        inputPlaceHolder="Test@example.com"
        inputId="emailSignUp"
        lableContent="ایمیل"
        validationType="isEmail"
        errorMessage="نامعتبر"
      />
      <FormGroup
        inputType="text"
        inputValue={userData.mobile}
        setInputValue={useCallback(
          (val) =>
            setUserData((prvs) => {
              return { ...prvs, mobile: val };
            }),
          [userData.mobile]
        )}
        inputPlaceHolder="5551122**09"
        inputId="mobileSignUp"
        lableContent="شماره همراه"
        validationType="isMobilePhone"
        opt="fa-IR"
        errorMessage="نامعتبر"
      />
      <FormGroup
        inputType="password"
        inputValue={userData.password}
        setInputValue={useCallback(
          (val) =>
            setUserData((prvs) => {
              return { ...prvs, password: val };
            }),
          [userData.password]
        )}
        inputPlaceHolder="********"
        inputId="passwordSignUp"
        lableContent="رمز عبور"
        validationType="isStrongPassword"
        opt={{
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        }}
        errorMessage="نامعتبر"
      />
      <FormGroup
        inputType="password"
        inputValue={userData.passwordC}
        setInputValue={useCallback(
          (val) =>
            setUserData((prvs) => {
              return { ...prvs, passwordC: val };
            }),
          [userData.passwordC]
        )}
        inputPlaceHolder="********"
        inputId="passwordCSignUp"
        lableContent="تایید رمز عبور"
        validationType="isEqual"
        opt={{
          password: userData.password,
        }}
        errorMessage="نامعتبر"
      />
      <div className="col-12">
        <SubmitButton
          submitbuttonClass="btn btn-primary"
          disabled={submitButtonController}
        >
          ثبت نام
        </SubmitButton>
      </div>
    </Form>
  );
};

export default SignUpForm;
