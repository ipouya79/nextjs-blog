import React, { useState } from "react";
import styles from "./SidebarPopular.module.css";
import { Container, Grid } from "@material-ui/core";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import Link from 'next/link'

function SidebarPopular(props) {
  //time setting function
  function timeDifference(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
      if (elapsed / 1000 < 30) return "هم اکنون";

      return Math.round(elapsed / 1000) + "  ثانیه پیش";
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + " دقیقه پیش ";
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + "ساعت پیش";
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + "  روز پیش";
    } else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + "  ماه پیش";
    } else {
      return Math.round(elapsed / msPerYear) + " سال پیش";
    }
  }

  const [mostPopular, setMostPopular] = useState(props.event);
  const popularSides = _.sortBy(mostPopular, ["totalRate"]);
  const lastThreeItem = _.takeRight(popularSides, 3);


  return (
    <>
      <div className={styles.containerPopularSide}>
        <Container>
          <Grid container direction="column" justifyContent="space-around">
            <h4 className={styles.titlePop}>محبوب ترین عنوان ها</h4>
            <Link  href={`/SingleBlog/${lastThreeItem[0].id}`}>

            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              className={styles.containerPerItem}
            >
              <Grid item={true} xs={5}>
               <img
                              id={styles.grayScale}

                  className={styles.imgsidebar}
                  src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastThreeItem[0].image}`}
                />
              </Grid>
              <Grid item={true} direction="column" xs={7}>
                <div className={styles.itemPopular}>
                  <Grid item={true}>
                    <p className={styles.papHeadText}>
                      {lastThreeItem[0].title}
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <p className={styles.popPara}>
                      {lastThreeItem[0].description.substring(0, 18)}
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <p className={styles.popPara}>
                      {" "}
                      <FontAwesomeIcon
                        icon={faClock}
                        className={styles.iconClock}
                      />{" "}
                      {timeDifference(
                        new Date(),
                        new Date(lastThreeItem[0].publishAt)
                      )}
                    </p>
                  </Grid>
                </div>{" "}
              </Grid>
            </Grid>
</Link>
<Link  href={`/SingleBlog/${lastThreeItem[1].id}`}>

            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              className={styles.containerPerItem}
            >
              <Grid item={true} xs={5}>
               <img
                              id={styles.grayScale}

                  className={styles.imgsidebar}
                  src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastThreeItem[1].image}`}
                />
              </Grid>
              <Grid item={true} direction="column" xs={7}>
                <div className={styles.itemPopular}>
                  <Grid item={true}>
                    <p className={styles.papHeadText}>
                      {lastThreeItem[1].title}
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <p className={styles.popPara}>
                      {lastThreeItem[1].description.substring(0, 18)}
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <p className={styles.popPara}>
                      {" "}
                      <FontAwesomeIcon
                        icon={faClock}
                        className={styles.iconClock}
                      />{" "}
                      {timeDifference(
                        new Date(),
                        new Date(lastThreeItem[1].publishAt)
                      )}
                    </p>
                  </Grid>
                </div>{" "}
              </Grid>
            </Grid>
            </Link>
            <Link  href={`/SingleBlog/${lastThreeItem[0].id}`}>

            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              className={styles.containerPerItem}
            >
              <Grid item={true} xs={5}>
               <img
                              id={styles.grayScale}

                  className={styles.imgsidebar}
                  src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastThreeItem[2].image}`}
                />
              </Grid>
              <Grid item={true} direction="column" xs={7}>
                <div className={styles.itemPopular}>
                  <Grid item={true}>
                    <p className={styles.papHeadText}>
                      {lastThreeItem[2].title}
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <p className={styles.popPara}>
                      {lastThreeItem[2].description.substring(0, 18)}
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <p className={styles.popPara}>
                      {" "}
                      <FontAwesomeIcon
                        icon={faClock}
                        className={styles.iconClock}
                      />{" "}
                      {timeDifference(
                        new Date(),
                        new Date(lastThreeItem[2].publishAt)
                      )}
                    </p>
                  </Grid>
                </div>{" "}
              </Grid>
            </Grid>
            </Link>
          </Grid>
        </Container>
      </div>
    </>
  );
}

export default SidebarPopular;
