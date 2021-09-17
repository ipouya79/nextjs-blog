import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/navigation/navigation.min.css";
import SwiperCore, { Pagination, Navigation, EffectFade  } from "swiper/core";
SwiperCore.use([Pagination, Navigation, EffectFade ]);

import Image from "next/image";
import car from "../assest/img/car.png";
import profile from "../assest/img/profile.png";
import timer from "../assest/img/timer.png";
import styles from "./Slider.module.css";
import classes from "./CardPosts.module.css";
import { Grid } from "@material-ui/core";
import Link from 'next/link';
function Slider(props) {
  const [arr, setarr] = useState(props.event);
  const [array, setarray] = useState([]);
  const arr1 = arr && arr.filter((item) => arr.indexOf(item) > 1);
  const show_card_posts =
    arr1 &&
    arr1.map((item, index) => {
      const x = new Date(item.publishAt);
      return (
        <SwiperSlide>
      <Link  href={`/SingleBlog/${item.id}`}> 
          <div key={index} className={classes.perCards}>
            <div className={classes.imageContainerBlog}>
              <img
                className={classes.imgCardPosts}
                src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${item.image}`}
              />
            </div>
            <div className={classes.blogContentSect}>
              <div>
                <p className={classes.postdetailtitle}>
                  <h5>{item.title}</h5>
                  <p>{item.description}</p>
                </p>
              </div>
              <div className={classes.blogContentDetail}>
                <div className={classes.blogContentDetailRightSide}>
                  <div className={classes.profileDiv}>
                    <img
                      className={classes.imgAuthorBlog}
                      src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${item.Author.image}`}
                    />
                  </div>
                  <div>
                    <p className={classes.propara}>{item.Author.name}</p>
                  </div>
                </div>
                <div className={classes.blogContentDetailLeftSide}>
                  <div className={classes.timerDiv}>
                    <Image src={timer} width={18} height={18} />
                  </div>
                  <div>
                    <p className={classes.propara}>
                      {x.toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </Link>
        </SwiperSlide>
      );
    });

  return (
    <>
      <div className={styles.containerSlider}>
        <Grid xs={12} lg={12}>
          <Swiper

            spaceBetween={10}
            className="mySwiper"
            breakpoints={{
              320: {
                slidesPerView: 1.20,
                spaceBetween: 10,

              },
              480: {
                slidesPerView: 1.5,
                spaceBetween: 10,

              },
              640: {
                slidesPerView: 2.30,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3.30,
                spaceBetween: 40,
              },
              900: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 4.30,
                spaceBetween: 40,
              },
              1100: {
                slidesPerView: 4.30,
                spaceBetween: 40,
              },
            }}
          >
            {show_card_posts}
          </Swiper>
        </Grid>
      </div>
    </>
  );
}

export default Slider;
