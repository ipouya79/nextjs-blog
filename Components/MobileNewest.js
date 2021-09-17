import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import Image from "next/image";
import "swiper/components/pagination/pagination.min.css";
import SwiperCore from "swiper/core";
import styles from "./NewestSidebar.module.css";
import classes from "./MobileNewest.module.css";
import { Grid, Hidden } from "@material-ui/core";
import suit from "../assest/img/suit.png";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";

export default function MobileNewest(props) {
  const [mostPopular, setMostPopular] = useState(props.event);
  const lastEightItem = _.takeRight(mostPopular, 8);

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
  return (
    <>
      <Hidden smUp>
        <div className={classes.mobileNewestContainer}>
          <Swiper
            slidesPerView={"auto"}
            spaceBetween={5}
            className="mySwiper"
            breakpoints={{
              320: {
                slidesPerView: 1.5,
              },
              480: {
                slidesPerView: 1.5,
              },
              640: {
                slidesPerView: 2,
              },
            }}
          >
            <SwiperSlide>
              {" "}
              <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                className={styles.containerPerItem}
              >
                <Grid item={true} xs={5} className={styles.mImagesSliders}>
                  <img
                    id={styles.grayScale}
                    className={styles.imgsidebar}
                    src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastEightItem[0].image}`}
                  />
                </Grid>
                <Grid item={true} direction="column" xs={7}>
                  <div className={styles.itemPopular}>
                    <Grid item={true}>
                      <p className={styles.papHeadText}>
                        {lastEightItem[0].title}
                      </p>
                    </Grid>
                    <Grid item={true}>
                      <p className={styles.popPara}>
                        {lastEightItem[0].description.substring(0, 18)}
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
                          new Date(lastEightItem[0].publishAt)
                        )}
                      </p>
                    </Grid>
                  </div>{" "}
                </Grid>
              </Grid>
            </SwiperSlide>
            <SwiperSlide>
              {" "}
              <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                className={styles.containerPerItem}
              >
                <Grid item={true} xs={5} className={styles.mImagesSliders}>
                  <img
                    id={styles.grayScale}
                    className={styles.imgsidebar}
                    src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastEightItem[1].image}`}
                  />
                </Grid>
                <Grid item={true} direction="column" xs={7}>
                  <div className={styles.itemPopular}>
                    <Grid item={true}>
                      <p className={styles.papHeadText}>
                        {lastEightItem[1].title}
                      </p>
                    </Grid>
                    <Grid item={true}>
                      <p className={styles.popPara}>
                        {lastEightItem[1].description.substring(0, 18)}
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
                          new Date(lastEightItem[1].publishAt)
                        )}
                      </p>
                    </Grid>
                  </div>{" "}
                </Grid>
              </Grid>
            </SwiperSlide>
            <SwiperSlide>
              {" "}
              <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                className={styles.containerPerItem}
              >
                <Grid item={true} xs={5} className={styles.mImagesSliders}>
                  <img
                    id={styles.grayScale}
                    className={styles.imgsidebar}
                    src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastEightItem[2].image}`}
                  />
                </Grid>
                <Grid item={true} direction="column" xs={7}>
                  <div className={styles.itemPopular}>
                    <Grid item={true}>
                      <p className={styles.papHeadText}>
                        {lastEightItem[2].title}
                      </p>
                    </Grid>
                    <Grid item={true}>
                      <p className={styles.popPara}>
                        {lastEightItem[2].description.substring(0, 18)}
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
                          new Date(lastEightItem[2].publishAt)
                        )}
                      </p>
                    </Grid>
                  </div>{" "}
                </Grid>
              </Grid>
            </SwiperSlide>

            <SwiperSlide>
              <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                className={styles.containerPerItem}
              >
                <Grid item={true} xs={5} className={styles.mImagesSliders}>
                  <img
                    id={styles.grayScale}
                    className={styles.imgsidebar}
                    src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastEightItem[3].image}`}
                  />
                </Grid>
                <Grid item={true} direction="column" xs={7}>
                  <div className={styles.itemPopular}>
                    <Grid item>
                      <p className={styles.papHeadText}>
                        {lastEightItem[3].title}
                      </p>
                    </Grid>
                    <Grid item={true}>
                      <p className={styles.popPara}>
                        {lastEightItem[3].description.substring(0, 18)}
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
                          new Date(lastEightItem[3].publishAt)
                        )}
                      </p>
                    </Grid>
                  </div>{" "}
                </Grid>
              </Grid>
            </SwiperSlide>
            <SwiperSlide>
              {" "}
              <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                className={styles.containerPerItem}
              >
                <Grid item={true} xs={5} className={styles.mImagesSliders}>
                  <img
                    id={styles.grayScale}
                    className={styles.imgsidebar}
                    src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastEightItem[4].image}`}
                  />
                </Grid>
                <Grid item={true} direction="column" xs={7}>
                  <div className={styles.itemPopular}>
                    <Grid item>
                      <p className={styles.papHeadText}>
                        {lastEightItem[4].title}
                      </p>
                    </Grid>
                    <Grid item={true}>
                      <p className={styles.popPara}>
                        {lastEightItem[4].description.substring(0, 18)}
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
                          new Date(lastEightItem[4].publishAt)
                        )}
                      </p>
                    </Grid>
                  </div>{" "}
                </Grid>
              </Grid>
            </SwiperSlide>
            <SwiperSlide>
              {" "}
              <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                className={styles.containerPerItem}
              >
                <Grid item={true} xs={5} className={styles.mImagesSliders}>
                  <img
                    id={styles.grayScale}
                    className={styles.imgsidebar}
                    src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastEightItem[0].image}`}
                  />
                </Grid>
                <Grid item={true} direction="column" xs={7}>
                  <div className={styles.itemPopular}>
                    <Grid item={true}>
                      <p className={styles.papHeadText}>
                        {lastEightItem[5].title}
                      </p>
                    </Grid>
                    <Grid item={true}>
                      <p className={styles.popPara}>
                        {lastEightItem[5].description.substring(0, 18)}
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
                          new Date(lastEightItem[5].publishAt)
                        )}
                      </p>
                    </Grid>
                  </div>{" "}
                </Grid>
              </Grid>
            </SwiperSlide>
          </Swiper>
        </div>
      </Hidden>
    </>
  );
}
