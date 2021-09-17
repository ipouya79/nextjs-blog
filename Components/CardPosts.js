import React,{useState} from "react";
import styles from "./CardPosts.module.css";
import Image from "next/image";
import timer from "../assest/img/timer.png";
import Link from 'next/link'
import Tags from "../pages/FiltredPage/[tags]";

function CardPosts(props) {



const show_card_posts = props.event && props.event.map((item,index)=>{
    const x = new Date(item.publishAt);
    return(
      <Link  href={`/SingleBlog/${item.id}`}>
        <div key={index} className={styles.perCards}>
          <div className={styles.imageContainerBlog}>
         
            <img className={styles.imgCardPosts} src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${item.image}`} />
          </div>
          <div className={styles.blogContentSect}>
            <div>
              <p className={styles.postdetailtitle}>
                <h5>{item.title}</h5>
                <p>{item.description}</p>
              </p>
            </div>
            <div className={styles.blogContentDetail}>
              <div className={styles.blogContentDetailRightSide}>
              <div className={styles.profileDiv}>
              <img className={styles.imgAuthorBlog} src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${item.Author.image}`} />
                      </div>
                      <div>
                        <p className={styles.propara}>{item.Author.name}</p>
                      </div>
              </div>
              <div className={styles.blogContentDetailLeftSide}>
              <div className={styles.timerDiv}>
                        <Image src={timer} width={18} height={18} />
                      </div>
                      <div>
                        <p className={styles.propara}>{x.toLocaleDateString("fa-IR")}</p>
                      </div>
              </div>
            </div>
          </div>
        </div>
        </Link>
)})
  return (
    <>
<div   className={styles.containerAllBlogPosts}> {show_card_posts}</div>
    </>
  );
}
export default CardPosts;
