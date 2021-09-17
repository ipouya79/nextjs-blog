import SignUpSignInButton from '../../../SignUpSignIn/SignUpSignInButton/SignUpSignInButton';
import HeaderIcons from '../Icons/Icons';
import Logo from '../Logo/Logo';
import OverLay from '../Overlay/Overlay';
import PageLinks from '../PageLinks/PageLinks';
import SearchBar from '../SearchBar/SearchBar';
import User from '../User/User';
import logo from '../../../../public/logo.png';
import { useState, useEffect } from 'react';
import MyWrapper from '../My/MyWrapper/MyWrapper';
import SearchBarResult from '../searchBarResult/SearchBarResult';

const HeaderDesktopView = ({
  searchBarAndLinksWrapper,
  user,
  setUserSearch,
  userSearch,
}) => {
  const [showStyle, setShowStyle] = useState('');

  useEffect(() => {
    function removeOverlay(e) {
      let target = e.target.closest('#searchBarOverLay');
      if (!target) {
        setShowStyle('');
        setUserSearch([]);
      }
      return;
    }

    if (showStyle !== '') {
      document.addEventListener('click', removeOverlay);
    }

    return () => document.removeEventListener('click', removeOverlay);
  }, [showStyle]);

  return (
    <div className="container-fluid justify-content-around d-none d-lg-flex">
      <div className="col-2">
        <Logo width={77} height={97} logo={logo} />
      </div>
      <div className={`col-4 ${searchBarAndLinksWrapper}`}>
        <SearchBar
          setShowStyle={setShowStyle}
          desktop={true}
          setUserSearch={setUserSearch}
        />
        <PageLinks
          cls="navbar-nav row row-cols-3 d-flex"
          navLiClass="headerLink"
        />
      </div>
      <HeaderIcons iconStyle="headerIconsWrapper" />
      <MyWrapper myStyle="col-md-3 d-flex flex-column align-items-end" />
      <div className="col-1">
        {user?.username && (user?.emailVerified || user?.mobileVerified) ? (
          <User userInfoClass="userInfoHeader" user={user} />
        ) : (
          <SignUpSignInButton desktopSize={true} />
        )}
      </div>
      <OverLay showStyle={showStyle} overLayStyle="searchBarOverLayResults">
        <SearchBarResult
          searchBarClass="list-group list-group-flush w-50"
          userSearch={userSearch}
        />
      </OverLay>
    </div>
  );
};

export default HeaderDesktopView;
