import mobilelogo from '../../../../public/mobilelogo.png';
import Logo from '../Logo/Logo';
import SignUpSignInButton from '../../../SignUpSignIn/SignUpSignInButton/SignUpSignInButton';
import User from '../User/User';
import SubHeader from './SubHeader/SubHeader';

const HeaderMobile = ({ user, setUserSearch, userSearch }) => {
  return (
    <>
      <div className="d-lg-none d-flex container-fluid justify-content-around position-relative">
        <div className="col-6">
          <Logo width={54} height={56} logo={mobilelogo} />
        </div>
        <div className="col-6 d-flex flex-wrap justify-content-end">
          {user?.username && (user?.emailVerified || user?.mobileVerified) ? (
            <User userInfoClass="userInfoHeaderMobile" user={user} />
          ) : (
            <SignUpSignInButton />
          )}
        </div>
      </div>
      <SubHeader setUserSearch={setUserSearch} userSearch={userSearch} />
    </>
  );
};

export default HeaderMobile;
