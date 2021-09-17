import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/components/scrollbar/scrollbar.min.css";
import SwiperCore, { Scrollbar } from "swiper/core";
import styles from "./CatgoryNav.module.css";
import { Grid, Hidden } from "@material-ui/core";
import {useQuery} from 'react-query'
import axios from "axios";

SwiperCore.use([Scrollbar]);

async function fetchCategory(){
  const {data}= await axios.get("https://iranchemi.com/api/category/tag/all?kind=1");
  return data;
}
function blogCatNav() {
 
const {data:category,error} = useQuery("category",fetchCategory)
const arr1 = category && category.filter((item) => category.indexOf(item) > 1);
const show_tags=category && category.map((item,index)=>{
return(
    <SwiperSlide key={index}> 
  <Grid className={styles.blog_subjects_items} >
    <Grid  className={styles.boxCat}>
      <span className={styles.span_grow}>{item.title.substring(0, 7)}</span>
      <img src={`https://testbucket.s3.ir-thr-at1.arvanstorage.com/${item.image}`} className={styles.blog_subjects_item_icon} />
    </Grid >
    </Grid >
</SwiperSlide>
  )
})
  return (
    <>
    <Grid className={styles.blog_subjects} xs={12} md={12} lg={12} >
     <div class={styles.swiperContainer} >
 <Swiper scrollbar={{ hide: true }}className="mySwiper" slidesPerView={12} spaceBetween={0}  >
{show_tags}
  </Swiper>
</div>
</Grid>

    </>
  );
}
export default blogCatNav;
