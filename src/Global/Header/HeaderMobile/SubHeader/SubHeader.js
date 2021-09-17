import BurgerMenu from '../../BurgerMenu/BurgerMenu';
import PageLinks from '../../PageLinks/PageLinks';
import SearchBar from '../../SearchBar/SearchBar';
import styles from './SubHeader.module.css';
import MyWrapper from '../../My/MyWrapper/MyWrapper';
import HeaderIcons from '../../Icons/Icons';
import { useState } from 'react';
import SearchBarResult from '../../searchBarResult/SearchBarResult';
import OverLay from '../../Overlay/Overlay';
import FAQIcon from '../../FAQIcon/FAQIcon';
const SubHeader = ({ userSearch, setUserSearch }) => {
  const [dropDownMenuHeight, setDropDownMenuHeight] = useState('');
  const [dropMenuContent, setDropMenuContent] = useState('search');
  const [burgerStyle, setBurgerStyle] = useState('');

  let DropMenuContent =
    dropMenuContent === 'menu' ? (
      <>
        <PageLinks cls="nav flex-column my-1" navLiClass="smallHeaderLink" />
        <MyWrapper myStyle="my-2" />
        <HeaderIcons iconStyle="headerIconWrapperMobile" />
      </>
    ) : dropMenuContent === 'search' ? (
      <SearchBarResult
        searchBarClass="list-group list-group-flush"
        userSearch={userSearch}
      />
    ) : (
      <div>locationnn</div>
    );

  return (
    <div
      className={`d-lg-none d-flex container-fluid justify-content-around mt-1 ${styles.subHeader}`}
    >
      <BurgerMenu
        setDropDownMenuHeight={setDropDownMenuHeight}
        setDropMenuContent={setDropMenuContent}
        burgerStyle={burgerStyle}
        setBurgerStyle={setBurgerStyle}
      />
      <div
        className={`col-8 d-flex flex-shrink-1 justify-content-between px-3 border-start border-end ${styles.midSubHeader}`}
      >
        <SearchBar
          setShowStyle={setDropDownMenuHeight}
          setDropMenuContent={setDropMenuContent}
          setBurgerStyle={setBurgerStyle}
          setUserSearch={setUserSearch}
        />
        <OverLay showStyle={dropDownMenuHeight} overLayStyle="droppedMenu">
          {DropMenuContent}
        </OverLay>
      </div>
      <FAQIcon />
    </div>
  );
};

export default SubHeader;
