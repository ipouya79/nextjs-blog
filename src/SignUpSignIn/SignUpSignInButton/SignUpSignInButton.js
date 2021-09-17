import styles from './SSButton.module.css';
import { useRouter } from 'next/router';

const SignUpSignInButton = ({ desktopSize }) => {
  const router = useRouter();

  if (desktopSize) {
    return (
      <>
        <button className={`${styles.glowSignInButton}`} type="button">
          ورود
        </button>
        <button className={`${styles.glowSignUpButton}`} type="button">
          ثبت نام
        </button>
      </>
    );
  } else {
    return (
      <>
        <div
          className={`d-flex flex-column align-items-center ${styles.signInBtnMobile}`}
        >
          <i className="fas fa-sign-in-alt" aria-hidden="true"></i>
          <span>ورود</span>
        </div>
        <div
          className={`d-flex flex-column ms-5 align-items-center ${styles.signUpBtnMobile}`}
        >
          <i className="fas fa-user-plus" aria-hidden="true"></i>
          <span>ثبت نام</span>
        </div>
      </>
    );
  }
};

export default SignUpSignInButton;
