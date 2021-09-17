import SignUpForm from './SignUpForm/SignUpForm';
import React, { useEffect, useState } from 'react';
import useRequest from '../../CustomHook/useRequest';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import submitValidate from '../../Util/validate/submitValidate';
import ParentConfirm from './SignUpForm/parentConfirm';
import { UseAppContext } from '../../Context/context';
import SignIn from '../SignIn/SignIn';

const SignUp = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
    passwordC: '',
  });

  const { user, changer } = UseAppContext();

  const [view, setView] = useState(true);

  const [expireDate, setExpireDate] = useState(Date.now());

  const [submitButtonController, setSubmitButtonController] = useState(false);

  useEffect(() => {
    if (
      user.username &&
      user.id &&
      (!user.emailVerified || !user.mobileVerified)
    ) {
      setView(false);
    }
  }, [user]);

  const doRequest = useRequest({
    url: '/api/user/signup',
    method: 'post',
    body: userData,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitButtonController(true);
    const result = submitValidate(userData, e.target.children);
    if (!result) {
      toast.error('لطفا تمامی ورودی ها را به درستی وارد کنید', {
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

    const responseData = await doRequest();

    if (responseData.status == 'fail') {
      toast.error(responseData.message || 'مشکلی رخ داده است', {
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

    toast.success(
      'اکانت شما ثبت شد لطفا کد های وارد شده به ایمیل و موبایتان را وارد کنید',
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
      type: 'sign',
      payload: {
        username: userData.username,
        email: userData.email.trim() || '',
        mobile: userData.mobile.trim() || '',
      },
    });

    console.log(responseData);

    setExpireDate(responseData.expireTime);

    setView(false);
  };

  const form = view ? (
    <SignUpForm
      formSubmitHandler={submitHandler}
      userData={userData}
      setUserData={setUserData}
      submitButtonController={submitButtonController}
    />
  ) : (
    <ParentConfirm expireDate={expireDate} setExpireDate={setExpireDate} />
  );

  return (
    <>
      <div className="container py-2">
        {form}
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
        <SignIn />
      </div>
    </>
  );
};

export default React.memo(SignUp);
