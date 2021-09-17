import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import styles from "./HeaderPosts.module.css";
import _ from "lodash";
import Link from "next/link";

function HeaderPosts(props) {
  const [mostPopular, setMostPopular] = useState(props.event);
  const XtotalRate = _.maxBy(mostPopular, "totalRate");
  const lastFourItem = _.takeRight(mostPopular, 4);

  return (
    <>
      <div className={styles.headerPostsContainer}>
        <Grid
          container
          justifyContent="space-around"
          direction="row"
          alignItems="stretch"
        >
          <Link href={`/SingleBlog/${XtotalRate.id}`}>
            <Grid items xs={5} sm={5} className={styles.bigimg}>
              <div className={styles.imageCard}>
                <div>
                  <img
                    className={styles.imgbiggest}
                    src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${XtotalRate.image}`}
                  />
                </div>
                <div className={styles.imageContent}>
                  <h3>{XtotalRate.title}</h3>
                  <p>{XtotalRate.description} </p>
                </div>
              </div>
            </Grid>
          </Link>
          <Grid
            items
            xs={3}
            sm={3}
            direction="column"
            className={styles.smallImg}
          >
            <Link href={`/SingleBlog/${lastFourItem[0].id}`}>
              <div className={styles.imageCardSmall}>
                <div>
                  <img
                    className={styles.imgsmall}
                    src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastFourItem[0].image}`}
                  />
                </div>{" "}
                <div className={styles.imageContentSmall}>
                  <h3>{lastFourItem[0].title}</h3>
                  <p>{lastFourItem[0].description}</p>
                </div>
              </div>
            </Link>
            <Link href={`/SingleBlog/${lastFourItem[1].id}`}>
              <div className={styles.imageCardSmall}>
                <div>
                  <img
                    className={styles.imgsmall}
                    src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastFourItem[1].image}`}
                  />
                </div>{" "}
                <div className={styles.imageContentSmall}>
                  <h3>{lastFourItem[1].title}</h3>
                  <p>{lastFourItem[1].description}</p>
                </div>
              </div>
            </Link>
          </Grid>
          <Grid
            items
            xs={3}
            sm={3}
            direction="column"
            className={styles.smallImg}
          >
            <Link href={`/SingleBlog/${lastFourItem[2].id}`}>
              <div className={styles.imageCardSmall}>
                <div>
                  <img
                    className={styles.imgsmall}
                    src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastFourItem[2].image}`}
                  />
                </div>{" "}
                <div className={styles.imageContentSmall}>
                  <h3>{lastFourItem[2].title}</h3>
                  <p>{lastFourItem[2].description}</p>
                </div>
              </div>
            </Link>
            <Link href={`/SingleBlog/${lastFourItem[3].id}`}>
              <div className={styles.imageCardSmall}>
                <div>
                  <img
                    className={styles.imgsmall}
                    src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastFourItem[3].image}`}
                  />
                </div>{" "}
                <div className={styles.imageContentSmall}>
                  <h3>{lastFourItem[3].title}</h3>
                  <p>{lastFourItem[3].description}</p>
                </div>
              </div>
            </Link>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default HeaderPosts;
