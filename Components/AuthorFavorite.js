import React from "react";
import styles from "./AuthorFavorite.module.css";
function AuthorFavorite() {
  return (
    <>
    
      <div className={styles.authorFavorite}>
        <div className={styles.chooseAuthor}>
          <p>منتخب سردبیر </p>
        </div>
        <div className={styles.seprator}></div>
        <div className={styles.showwAll}>
          <p className={styles.seeAll}>مشاهده همه</p>
        </div>
      </div>
    </>
  );
}

export default AuthorFavorite;
