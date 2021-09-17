import Form from '../../../Components/Form/Form';
import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import styles from '../SignUp.module.css';
import { UseAppContext } from '../../../Context/context';

const ReactCodeInput = dynamic(() => import('react-code-input'), {
  ssr: false,
});

const ConfirmForm = ({
  formSubmitHandler,
  codes,
  setUserCodes,
  submitButtonController,
  isCountdownTimeFinished,
}) => {
  const { user } = UseAppContext();

  let type = user.email ? 'ایمیل' : 'موبایل';

  return (
    <Form formSubmitHandler={formSubmitHandler} formClass="mb-4 col-md-6">
      <div className={styles.inputSixField}>
        <label htmlFor="code">{`لطفا کد ارسال شده به ${type} راوارد کنید`}</label>
        <ReactCodeInput
          type="text"
          fields={6}
          onChange={useCallback(
            (val) =>
              setUserCodes((prvs) => {
                return { ...prvs, code: val };
              }),
            [codes.code]
          )}
          value={codes.code}
          id="code"
        />
      </div>
      <div className={`form-floating mb-3 col-lg-7 col-9 ${styles.formFloat}`}>
        <input
          type="text"
          id="floatingInput"
          className="form-control"
          placeholder="Sarafraz1234554321"
        />
        <label htmlFor="floatingInput">کد معرف</label>
      </div>
      <div className={styles.buttonConfCodeWrapper}>
        <button
          disabled={submitButtonController}
          className="btn btn-primary mt-3"
        >
          {isCountdownTimeFinished ? 'ارسال مجدد' : 'ثبت'}
        </button>
      </div>
    </Form>
  );
};

export default ConfirmForm;
