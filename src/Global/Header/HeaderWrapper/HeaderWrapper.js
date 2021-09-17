import styles from './HeaderWrapper.module.css';
import { UseAppContext } from '../../../Context/context';
import HeaderDesktopView from '../HeaderDesktopView/HeaderDesktopView';
import HeaderMobile from '../HeaderMobile/HeaderMobile';
import { useState } from 'react';

const HeaderWrapper = () => {
  const { user } = UseAppContext();

  const [userSearch, setUserSearch] = useState({});

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg navbar-white bg-white px-4 mb-2 ${styles.navBar}`}
      >
        <HeaderDesktopView
          searchBarAndLinksWrapper={styles.searchBarAndLinksWrapper}
          user={user}
          userSearch={userSearch}
          setUserSearch={setUserSearch}
        />
        <HeaderMobile
          user={user}
          userSearch={userSearch}
          setUserSearch={setUserSearch}
        />
      </nav>
    </>
  );
};

export default HeaderWrapper;
