import { Box, Button, Container, Grid, Hidden } from "@material-ui/core";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import CatgoryNav from "./CatgoryNav";
import AuthorFavorite from "./AuthorFavorite";
import Footer from "./Footer";
import HeaderPosts from "./HeaderPosts";
import MainHeader from "./MainHeader";
import SidebarPopular from "./SidebarPopular";
import NewestSidebar from "./NewestSidebar";
import ShowPost from "./ShowPost";
import SidebarNewTech from "./SidebarNewTech";
import CardPosts from "./CardPosts";
import PupTitles from "./PupTitles";
import MobileNewest from "./MobileNewest";
import Slider from './Slider'
export default function Home(props) {
  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
          integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
          crossOrigin="anonymous"
        />
      </Head>
      {/* <MainHeader /> */}
      <div className={styles.mobileContainer}>
        <div className={styles.topPostMobile}>
          <ShowPost event={props.myevent} />
        </div>
        <Hidden mdUp>
          <div className={styles.favoriteAut}>
            <AuthorFavorite />
          </div>
        </Hidden>
        <Hidden smUp>
          <div className={styles.sliderMobile}>
          <Slider event={props.myevent}/>
            <Slider />
          </div>
          <div className={styles.favoriteAut}>
            <AuthorFavorite />
          </div>
          <Container>
            <Grid item={true} xs={12} md={4} lg={3}>
              <div className={styles.divvsidebarrpup}>
                <SidebarPopular event={props.myevent}/>
              </div>
            </Grid>
          </Container>

          <div className={styles.favoriteAut}>
            <AuthorFavorite />
          </div>
          <div className={styles.sliderMobile}>
          <Slider event={props.myevent}/>
          </div>
          <div className={styles.favoriteAut}>
            <AuthorFavorite />
          </div>
          <div className={styles.sidebarSlider}>
            <MobileNewest  event={props.myevent} />
          </div>
          <div className={styles.favoriteAut}>
            <AuthorFavorite />
          </div>
          <div className={styles.sidebarSlider}>
            <MobileNewest  event={props.myevent} />
          </div>
        </Hidden>
      </div>
      <Hidden mdDown>
        <CatgoryNav />
      </Hidden>
      <div className="dev-divide-top">
          <Container maxWidth="lg">
            <Grid container direction="row" justifyContent="space-around">
              <Grid item={true} xs={12} md={4} lg={3}>
                <Hidden smDown>
                  <PupTitles />
                  <SidebarPopular event={props.myevent} />
                </Hidden>
              </Grid>
              <Grid
                item={true}
                xs={12}

                md={8}
                lg={9}
                direction="column"
              >
                <Hidden xsDown>
                  <Grid>
                    <HeaderPosts  event={props.myevent} />
                  </Grid>
                </Hidden>
                <Grid>
                  <Hidden xsDown>
                    <AuthorFavorite />
                  </Hidden>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        
      </div>


<Hidden xsDown>
      <Grid xs={12} md={10} lg={10} className="dev-slider" > 
        <Slider event={props.myevent}/>
      </Grid>
</Hidden>


      {/* Sect Two */}
      <div className="dev-divide-top">
          <Container maxWidth="lg">
            <Grid container direction="row" justifyContent="space-between">
              <Grid item={true} xs={12} md={4} lg={3} direction="column">
                <Hidden xsDown>
                  <NewestSidebar event={props.myevent} />

                  <PupTitles />
                  <SidebarNewTech event={props.myevent}/>
                </Hidden>
              </Grid>
              <Grid item={true} xs={12} md={8} lg={9} direction="column">
                <Hidden xsDown>
                  <ShowPost event={props.myevent}/>
                </Hidden>
                <Hidden xsDown>
                  <CardPosts event={props.myevent} />
                </Hidden>
              </Grid>
            </Grid>
          </Container>
      </div>
      <Footer />
    </div>
  );
}
