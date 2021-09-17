import React from 'react'
import { Container, Grid ,Hidden} from "@material-ui/core";
import { useRouter } from "next/router";
import Link from 'next/link'
import styles from "../Components/NewestSidebar.module.css";
import Image from "next/image";
import suit from "../assest/img/suit.png";
import ad from "../assest/img/ad.png";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { PinDropRounded } from "@material-ui/icons";

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

function SideSingle({items}) {

  const show_single_side_blog =
    items &&
    items.map((item, index) => {
      return (

        <Link  href={`/SingleBlog/${item.id}`}>

         
         <Grid key={index}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              className={styles.containerPerItem}
            >
              <Grid item={true} xs={5} >
               <img
               id={styles.grayScale}
                  className={styles.imgsidebar}
                  src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${item.image}`}
                />
              </Grid>
              <Grid item={true} direction="column" xs={7} >
                <div className={styles.itemPopular}>
                  <Grid item={true}>
                    <p className={styles.papHeadText}>
                      {item.title}
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <p className={styles.popPara}>
                      {item.description.substring(0, 18)}
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <p className={styles.popPara}>
                      <FontAwesomeIcon
                        icon={faClock}
                        className={styles.iconClock}
                      />
                      {timeDifference(
                        new Date(),
                        new Date(item.publishAt)
                      )}
                    </p>
                  </Grid>
                </div>{" "}
              </Grid>
            </Grid>
        </Link>
      );
    });

  
    return (
             <div className={styles.containerPopularSide}>
        <Container>
          <Grid container direction="column" justifyContent="space-around" >
            <h4 className={styles.titlePop}>جدید ترین ها</h4>
            {show_single_side_blog}
            </Grid>
            </Container>
            </div>
    )
}

export default SideSingle
