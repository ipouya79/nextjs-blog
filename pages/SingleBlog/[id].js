import { useRouter } from "next/router";
import SideSingle from "../../Components/SideSingle";
import React, { useState } from "react";
import _ from "lodash";
import SingleDetail from "../../Components/SingleDetail";
import { Box, Container, Grid, StylesProvider } from "@material-ui/core";
import styles from "../../Components/SinglePage.module.css";
import Wrapper from "../../Components/Posts/RateTagComment/Wrapper";
import Comment from '../../Components/Comment/Comment'
import TagPage from '../FiltredPage/[tags]'

import {
  makeStyles,
  createTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Comments from "../../Components/Comments";
import { CssBaseline } from "@material-ui/core";


export async function getStaticPaths() {
  const res = await fetch("https://iranchemi.com/api/blogs/all");
  const blogs = await res.json();

  const paths =
    blogs &&
    blogs.map((blog) => ({
       params: { id: blog.id.toString() },
    }));

  return { paths, fallback: true };
}
export async function getStaticProps({ params }) {
  const res = await fetch(`https://iranchemi.com/api/blog/${params.id}`);
  const blog = await res.json();

  return {
    props: { events: blog.blog, sidebar: blog.blogs },
  };
}



const useStyles = makeStyles({
  spacing: {
    marginTop: "50px",
  },
  header: {
    marginTop: "40px",
    fontWeight: 600,
  },
  button: {
    color: "orange",
  },
});

export default function BlogPost(props) {

  const router = useRouter();
  const rQuery = router.query;
const BlogTags= props.events.BlogCatOrTags;

  return (
    <>
      <div className="dev-divide-top">
        <Container maxWidth="lg" flexDirection="row">
          <Grid Container justifyContent="space-between">
            <div className={styles.singleContainer}>
              <Grid
                item={true}
                xs={12}
                sm={12}
                md={8}
                lg={9}
                className={styles.detailSide}
              >
                <SingleDetail items={props.events} />
                <Wrapper items={BlogTags}  />




             {/* <div style={{display:"none"}}><TagPage items={BlogTags}  /></div>    */}
           
<Comment/>           
           
                
              </Grid>
              <Grid item={true} xs={12} sm={12} md={4} lg={3}>
                <SideSingle items={props.sidebar} />
              </Grid>
            </div>
          </Grid>
        </Container>
      </div>
    </>
  );
}



