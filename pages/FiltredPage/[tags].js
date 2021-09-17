import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import _ from "lodash";
import styles from "../../Components/CardPosts.module.css";
import Image from "next/image";
import timer from "../../assest/img/timer.png";
import Link from 'next/link'
import { Grid } from "@material-ui/core";

export default function Tags() {


  const router = useRouter();
  const route = router.query.tags;

  async function fetchtags() {

    const { data } = await axios.get(
      `https://iranchemi.com/api/category/tag/relative/blogs/${route}`
    );
    return data
  }

  const { data: tags, error } = useQuery("tags", fetchtags);



const result = _.map(tags, 'Blogs');
  const AllBlogsRelatedTag = _.head(result);
  const Blogs = AllBlogsRelatedTag



  const itemsTags = ["جدیدترین ها", "محبوب ترین ها"];

  const relatedBlogs = Blogs && Blogs.map((item, index) => {
    const x = new Date(item.publishAt);
    return (
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
                  {/* <img className={styles.imgAuthorBlog} src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${item.Author.image}`} /> */}
                </div>
                <div>
                  {/* <p className={styles.propara}>{item.Author.name}</p> */}
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

    )
  })


  return (
    <>

<Grid container >
<Grid item="true" xs={10} sm={12} md={12} lg={11}>
<div style={{marginRight:" 3rem"}} className={styles.containerAllBlogPosts}>{relatedBlogs}</div>

</Grid>
</Grid>

    </>
  );
}
