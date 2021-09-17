import { useEffect, useState } from 'react';
import ConfirmView from './ConfirmView';
import Timer from './Timer';
import { UseAppContext } from '../../../Context/context';

const ParentConfirm = ({ expireDate, setExpireDate }) => {
  const [isCountdownTimeFinished, setCountdownTime] = useState(false);

  const { user } = UseAppContext();

  useEffect(() => {
    if (
      user.username &&
      user.id &&
      !user.emailVerified &&
      !user.mobileVerified
    ) {
      setCountdownTime(true);
    }
  }, []);

  return (
    <>
      <ConfirmView
        isCountdownTimeFinished={isCountdownTimeFinished}
        setExpireDate={setExpireDate}
        setCountdownTime={setCountdownTime}
      />
      <Timer expireTime={expireDate} setCountdownTime={setCountdownTime} />
    </>
  );
};

export default ParentConfirm;
