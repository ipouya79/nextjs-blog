import React from 'react';
import { BASE_URL } from '../../../BASE_URL/baseUrl';

import styles from './SearchBar.module.css';
const SearchBar = ({
  setShowStyle,
  desktop,
  setDropMenuContent,
  setBurgerStyle,
  setUserSearch,
}) => {
  let timer;

  const searchHandler = (e) => {
    clearTimeout(timer);
    let text = e.target.value;

    if (text && text.trim()) {
      timer = setTimeout(async () => {
        const searchRes = await fetch(
          `${BASE_URL}/api/search/all?search=${text}`
        );

        if (searchRes.status === 200) {
          const searchResJson = await searchRes.json();
          setUserSearch(searchResJson);
          if (desktop) {
            setShowStyle('showStyle');
          } else {
            setDropMenuContent('search');
            setShowStyle((prvs) => {
              if (prvs === '') {
                prvs = 'droppedMenuHeight';

                setBurgerStyle('opened');

                return prvs;
              } else {
                return prvs;
              }
            });
          }
        }
      }, 2000);
    } else {
      setUserSearch([]);
    }
  };

  return (
    <div
      className={`input-group input-group-sm ${
        desktop ? styles.searchBar : styles.smallSearchBar
      }`}
    >
      <span
        className={`input-group-text border-0 ${
          desktop ? styles.roundedIcon : styles.smallRoundedIcon
        }`}
      >
        <i className="fa fa-search" aria-hidden="true"></i>
      </span>
      <input
        className={`form-control border-0 ${styles.roundedInput}`}
        type="text"
        placeholder="جستجو در بیلبورد ..."
        onChange={searchHandler}
        defaultValue=""
      />
    </div>
  );
};

export default React.memo(SearchBar);
