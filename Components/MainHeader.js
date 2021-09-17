import React, { useState } from "react";
import Image from "next/image";
import banner from "../assest/img/banner.png";
import Container from "@material-ui/core/Container";
import { Box } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import styles from "./MainHeader.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
function MainHeader() {
  const [cityname, setcityname] = useState(false);
  const onClick = () => setcityname(true);
  const clearCity = () => setcityname("");

  return (
    <>
      <div className={styles.mainHeaderContainer}>
        <Box width="100%">
          <Container maxWidth="lg">
            <Grid container direction="column" justifyContent="center" xs={12}>
              <Grid item={true}>
                <Image src={banner} width={1240} height={139} />
              </Grid>
              <Grid item={true}>
                <div className={styles.navLine}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Grid item={true}>
                      <li className={styles.liMen}>
                        <a>بیلبورد </a>
                        <a>/</a>
                        <a>بلاگ </a>
                      </li>
                    </Grid>
                    <Grid item={true}>
                      <Hidden xsDown>
                        <div className={styles.leftSide}>
                          <div>
                            <div className={styles.iconCity}>
                              {cityname ? (
                                <p className={styles.city} onClick={clearCity}>
                                  {cityname} ×
                                </p>  ) : null}
                            
                            </div>
                          </div>
                          <div className={styles.leftSideText}>
                            <div>
                              <FontAwesomeIcon
                                icon={faMapMarkerAlt}
                                className={styles.mapIcon}
                              />
                            </div>

                            <div>
                              <select
                                className={styles.chooseCity}
                                value={cityname}
                                onChange={(e) => {
                                  const selectedCity = e.target.value;
                                  setcityname(selectedCity);
                                }}
                              >
                                <option value="--">
                                  شهر خود را انتخاب کنید
                                </option>
                                <option onClick={onClick} value="گیلان">
                                  گیلان
                                </option>
                                <option onClick={onClick} value="شیراز">
                                  شیراز
                                </option>
                                <option onClick={onClick} value="تهران">
                                  تهران
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </Hidden>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </div>
    </>
  );
}

export default MainHeader;
