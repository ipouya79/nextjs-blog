import Countdown from "react-countdown";
import styles from "../SignUp.module.css";

const Timer = ({ expireTime, setCountdownTime }) => {
  const finishCount = () => {
    setCountdownTime(true);
  };

  const renderer = ({ hours, minutes, seconds, completed }) => {
    return (
      <span>
        {seconds} : {minutes}
      </span>
    );
  };

  return (
    <div className={styles.timerWrapper}>
      <p>زمان باقی مانده تا انقضا :</p>
      <Countdown
        date={expireTime}
        onComplete={finishCount}
        key={expireTime}
        renderer={renderer}
      />
    </div>
  );
};

export default Timer;
