import React,{useState,useEffect} from 'react';
import { Grid } from '@material-ui/core';
import styles from './ShowPost.module.css';
import Image from "next/image";
import doll from "../assest/img/doll.png";
import _ from "lodash";

function ShowPost(props) {
  const [mostPopular, setMostPopular] = useState(props.event);
  const XtotalRate = _.maxBy(mostPopular, "totalRate");
    return (
        <>
           <div className={styles.showPostContainer}>
<Grid container direction="column">
<Grid item={true}>
<img
  className={styles.toppestBlog}
  src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${XtotalRate && XtotalRate.image}`}
                />
</Grid>
<Grid item={true} container direction="column">
    
<Grid className={styles.postDescription}>
       <p className={styles.postTitle}>
        {XtotalRate && XtotalRate.title} 
       </p>   
          <p className={styles.postDescPara}>
          {XtotalRate && XtotalRate.description} 
          </p>
        </Grid>
</Grid>
</Grid>
        </div>
        </>
    )
}
export default ShowPost
