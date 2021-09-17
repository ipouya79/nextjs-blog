import React from "react";
import styles from "./PupTitles.module.css";
function PupTitles() {
  return (
    <>
      <div className={styles.authorFavorite}>
        <div className={styles.chooseAuthor}>
          <p>جدید ترین اخبار و مقاله ها </p>
        </div>
        <div className={styles.seprator}></div>
        <div className={styles.showwAll}>
          <p></p>
        </div>
      </div>
    </>
  );
}

export default PupTitles;
