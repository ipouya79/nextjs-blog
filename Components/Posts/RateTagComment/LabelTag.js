import React from "react";
import styles from "./LabelTag.module.css";
import Link from "next/link";

function LabelTag({ items }) {

  const show_labels= items &&  items.map((item,index)=>{
return(
  <div key={index}>
    <Link href={`/FiltredPage/${item.id}`}>
    <span>{item.title}</span>
    </Link>
  </div>
)
})

  return (
    <>
      <div className={styles.containerTags}>
        <div>
          <span className={styles.taglabel}> برچسب ها:</span>
        </div>
        <div className={styles.typeTags}>
           <span>{show_labels[0]} </span>
        </div>
      </div>
    </>
  );
}

export default LabelTag;
