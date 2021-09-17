
import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

const labels = {
  1: 'Useless+',
 2: 'Poor+',
  3: 'Ok+',
  4: 'Good+',
  5: 'Excellent+',
};

const useStyles = makeStyles({
  root: {
    width: 200,
    display: 'flex',
    alignItems: 'center',
    direction:'ltr'
  },
});

export default function HoverRating() {
  const [value, setValue] = useState(2);
  const [hover, setHover] = useState(-1);
  const classes = useStyles();
  const starValue = value;
console.log(starValue);  
  return (
    <>

    <div className={classes.root}>
      <Rating 

        name="hover-feedback"
        value={value}
        precision={1}
        // onChange={event => setValue(event.target.value)}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
      />
      {value !== null && <Box ml={2}>{labels[hover !== -1 ? hover : value]}</Box>}
    </div>
    </>
  );
}








// import React, { useState } from "react";
// import Rating from "react-rating";
// import StarBorderIcon from '@material-ui/icons/StarBorder';
// import StarIcon from '@material-ui/icons/Star';
// function StarRating() {
//   const [rating3, setRating3] = useState(5);

//   return (
//     <div className="App">
//       <Rating
//         fractions={2}
//         emptySymbol=<StarBorderIcon color="secondary" />
//         fullSymbol=<StarIcon color="secondary"/>
//         initialRating={rating3}
//         onClick={rate => setRating3(rate)}
//       />
      
       
//     </div>
//   );
// }

// export default StarRating;

