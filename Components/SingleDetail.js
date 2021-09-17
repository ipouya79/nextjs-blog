import React from "react";
import { Container, Grid, Hidden } from "@material-ui/core";
import parse from 'html-react-parser';
function SingleDetail({ items }) {
  const show_single_blog_detail = (
    <div>
      <p>{items.id}</p>
      <p>{items.title}</p>
      <p>{items.description}</p>
      <div>{parse(items.body)}</div>
    </div>
  );

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="space-around"
        style={{ marginRight: "2rem" , marginTop:"2rem" }}
      >
        {show_single_blog_detail}
      </Grid>
    </>
  );
}

export default SingleDetail;
