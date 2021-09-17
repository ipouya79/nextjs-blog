import React from 'react';
import Image from'next/image';
import Container from '@material-ui/core/Container';
import { Box } from '@material-ui/core';
import {Grid} from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';
import egold from "../assest/img/egold.png";
import eblue from "../assest/img/eblue.png";
import enemad from "../assest/img/enemad.png"; 
import styles from './Footer.module.css';


function Footer() {
    return (
        <>
        <div  className={styles.containerFooter}>
        <Container maxWidth="lg" >
        <Grid container  spacing={5}>
        <Grid item={true} xs={6} sm={3} >
            <div className={styles.textFooterDiv}>
                 <h4>راهنمای خرید از بیلبورد</h4>
         <p><a>نحوه ثبت اگهی</a></p>
         <p><a>رویه نحوه ارسال</a> </p>
         <p><a>شیوه های پرداخت</a></p>

            </div>
        
        </Grid>
        <Grid item={true} xs={6} sm={3}>
            <div className={styles.textFooterDiv}>
                <h4>خدمات مشتریان</h4>
         <p><a>پاسخ به پرسش های متداول</a></p>
         <p> <a>گزارش مشکل</a></p>
         <p> <a>قوانین و مقررات</a></p>
            </div>
    
        </Grid>
        <Grid item={true} xs={6} sm={3}>
            <div className={styles.textFooterDiv}>
            <Hidden xsDown>
                <div className={styles.textBabil}>
                <h4>با بیلبورد</h4>
         <p> <a>تماس با بیلبورد</a></p>
         <p><a>درباره بیلبورد</a> </p>
            </div>
  </Hidden>           
  <div className={styles.socialMedia}><p> <a>در شبکه های اجتماعی با ما همراه باشید:</a>  </p>
         <div className={styles.iconFooter}>
         <i className="fab fa-twitter"></i>
         <i className="fab fa-twitter"></i>
          <i className="fab fa-twitter"></i>
        <i className="fab fa-twitter"></i>
         </div>
         </div>
            </div>
       
        </Grid>
        <Grid item={true} xs={6} sm={3}>

        <div className={styles.imagesFooter}>
             <div><Image src={egold} width={85} height={85} /></div> 
             <div><Image src={eblue} width={85} height={85} /></div> 
             <div><Image src={enemad} width={85} height={85} /></div> 
</div>
        </Grid>
        </Grid>
      </Container>
        </div>
        
        </>
    )
}

export default Footer
