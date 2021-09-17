import React,{useState} from 'react';
import styles from './SidebarNewTech.module.css';
import Link from 'next/link'
import Image from "next/image";
import suit from "../assest/img/suit.png";
import { Container, Grid } from "@material-ui/core";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";

function SidebarNewTech(props) {

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
const [newest, setNewest] = useState(props.event);
const lastNewest = _.takeRight(newest, 8);
    return (
        <>
             <div className={styles.containerPopularSide}>
        <Container>
          <Grid container direction="column" justifyContent="space-around">
            <h4 className={styles.titlePop}>جدید ترین اخبار تکنولوژی</h4>
            <Link  href={`/SingleBlog/${lastNewest[0].id}`}>

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
                  src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastNewest[0].image}`}
                />
              </Grid>
              <Grid item={true} direction="column" xs={7}>
                <div className={styles.itemPopular}>
                  <Grid item={true}>
                    <p className={styles.papHeadText}>
                      {lastNewest[0].title}
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <p className={styles.popPara}>
                      {lastNewest[0].description.substring(0, 18)}
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
                        new Date(lastNewest[0].publishAt)
                      )}
                    </p>
                  </Grid>
                </div>{" "}
              </Grid>
            </Grid>
</Link>
<Link  href={`/SingleBlog/${lastNewest[1].id}`}>

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
                  src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastNewest[1].image}`}
                />
              </Grid>
              <Grid item={true} direction="column" xs={7}>
                <div className={styles.itemPopular}>
                  <Grid item={true}>
                    <p className={styles.papHeadText}>
                      {lastNewest[1].title}
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <p className={styles.popPara}>
                      {lastNewest[1].description.substring(0, 18)}
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
                        new Date(lastNewest[1].publishAt)
                      )}
                    </p>
                  </Grid>
                </div>{" "}
              </Grid>
            </Grid>
            </Link>
            <Link  href={`/SingleBlog/${lastNewest[2].id}`}>

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
                  src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastNewest[2].image}`}
                />
              </Grid>
              <Grid item={true} direction="column" xs={7}>
                <div className={styles.itemPopular}>
                  <Grid item={true}>
                    <p className={styles.papHeadText}>
                      {lastNewest[2].title}
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <p className={styles.popPara}>
                      {lastNewest[2].description.substring(0, 18)}
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
                        new Date(lastNewest[2].publishAt)
                      )}
                    </p>
                  </Grid>
                </div>{" "}
              </Grid>
            </Grid>
            </Link>
            <Link  href={`/SingleBlog/${lastNewest[3].id}`}>

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
                  src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastNewest[3].image}`}
                />
              </Grid>
              <Grid item={true} direction="column" xs={7}>
                <div className={styles.itemPopular}>
                  <Grid item={true}>
                    <p className={styles.papHeadText}>
                      {lastNewest[3].title}
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <p className={styles.popPara}>
                      {lastNewest[3].description.substring(0, 18)}
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
                        new Date(lastNewest[3].publishAt)
                      )}
                    </p>
                  </Grid>
                </div>{" "}
              </Grid>
            </Grid>
            </Link>
            <Link  href={`/SingleBlog/${lastNewest[4].id}`}>

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
                  src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastNewest[4].image}`}
                />
              </Grid>
              <Grid item={true} direction="column" xs={7}>
                <div className={styles.itemPopular}>
                  <Grid item={true}>
                    <p className={styles.papHeadText}>
                      {lastNewest[4].title}
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <p className={styles.popPara}>
                      {lastNewest[4].description.substring(0, 18)}
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
                        new Date(lastNewest[4].publishAt)
                      )}
                    </p>
                  </Grid>
                </div>{" "}
              </Grid>
            </Grid>
            </Link>
            <Link  href={`/SingleBlog/${lastNewest[5].id}`}>

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
                  src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastNewest[5].image}`}
                />
              </Grid>
              <Grid item={true} direction="column" xs={7}>
                <div className={styles.itemPopular}>
                  <Grid item={true}>
                    <p className={styles.papHeadText}>
                      {lastNewest[5].title}
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <p className={styles.popPara}>
                      {lastNewest[5].description.substring(0, 18)}
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
                        new Date(lastNewest[5].publishAt)
                      )}
                    </p>
                  </Grid>
                </div>{" "}
              </Grid>
            </Grid>
            </Link>
            <Link  href={`/SingleBlog/${lastNewest[6].id}`}>

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
                  src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastNewest[6].image}`}
                />
              </Grid>
              <Grid item={true} direction="column" xs={7}>
                <div className={styles.itemPopular}>
                  <Grid item={true}>
                    <p className={styles.papHeadText}>
                      {lastNewest[6].title}
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <p className={styles.popPara}>
                      {lastNewest[6].description.substring(0, 18)}
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
                        new Date(lastNewest[6].publishAt)
                      )}
                    </p>
                  </Grid>
                </div>{" "}
              </Grid>
            </Grid>
            </Link>
            <Link  href={`/SingleBlog/${lastNewest[7].id}`}>

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
                  src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${lastNewest[7].image}`}
                />
              </Grid>
              <Grid item={true} direction="column" xs={7}>
                <div className={styles.itemPopular}>
                  <Grid item={true}>
                    <p className={styles.papHeadText}>
                      {lastNewest[7].title}
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <p className={styles.popPara}>
                      {lastNewest[7].description.substring(0, 18)}
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
                        new Date(lastNewest[7].publishAt)
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


export default SidebarNewTech
