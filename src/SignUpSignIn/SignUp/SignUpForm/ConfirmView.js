import { useState } from 'react';
import ConfirmForm from './confirmForm';
import { ToastContainer, toast } from 'react-toastify';
import useRequest from '../../../CustomHook/useRequest';
import { UseAppContext } from '../../../Context/context';

const ConfirmView = ({
  isCountdownTimeFinished,
  setExpireDate,
  setCountdownTime,
}) => {
  const [codes, setCodes] = useState({
    code: '',
    networkCode: '',
  });

  const doRequest = useRequest({
    url: '/api/user/confirm',
    method: 'post',
    body: !isCountdownTimeFinished ? codes : {},
  });

  const { user, changer } = UseAppContext();

  const [submitButtonController, setSubmitButtonController] = useState(false);
  const formSubmitHandler = async (e) => {
    e.preventDefault();

    setSubmitButtonController(true);

    if (!isCountdownTimeFinished) {
      const result = codes.code && codes.code.length === 6;
      if (!result) {
        toast.error('لطفا ابتدا کد تایید خود را وارد کنید', {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setSubmitButtonController(false);
        return;
      }
    }

    try {
      const responseData = await doRequest();

      console.log(responseData);

      if (responseData.status == 'fail') {
        toast.error(
          responseData.message || 'مشکلی رخ داده است لطفا دوباره سعی کنید',
          {
            position: 'bottom-left',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        setSubmitButtonController(false);

        return;
      }
      if (!isCountdownTimeFinished) {
        toast.success(
          `گرامی به بیلبورد خوش آمدید ${user.username || 'کاربر'}`,
          {
            position: 'bottom-left',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );

        changer({
          type: 'verify',
          payload: {
            emailVerified: user.email || '',
            mobileVerified: user.mobile || '',
          },
        });
      } else {
        toast.success('کد تایید جدید ارسال شد', {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setExpireDate(responseData.expireTime);
        setCountdownTime(false);
        setSubmitButtonController(false);
      }
    } catch (err) {
      toast.error(err.message || 'مشکلی رخ داده است لطفا دوباره سعی کنید', {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setSubmitButtonController(false);
    }
  };

  return (
    <>
      <ConfirmForm
        codes={codes}
        setUserCodes={setCodes}
        formSubmitHandler={formSubmitHandler}
        submitButtonController={submitButtonController}
        isCountdownTimeFinished={isCountdownTimeFinished}
      />
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default ConfirmView;
