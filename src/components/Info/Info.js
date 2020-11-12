import React, { useState, useContext, useRef } from 'react';
import { Card, makeStyles, CardActionArea, CardActions, CardContent, CardMedia, Typography, Button } from '@material-ui/core';
import { Frame, Stack } from "framer";
import ChangeThemeColor, {myContext} from '../ChangeThemeColor/ChangeThemeColor';
import Parser from 'html-react-parser';

const useStyles = makeStyles({
    root: {
      width: 300,
      height: 200,
    //  backgroundColor: '#4c6272',
      color: '#61dafb',
      float: "right",
      display: "flex",
      flexDirection: "column",
      justifyContent: 'space-between',
      alignContent: 'space-around',
      marginTop: '5px',
      overflow: 'hidden',
    },
    media: {
      height: 20,
      textAlign: 'center'

    }
  });

const Info = props => {

    const [isActive, setActive] = useState(false);
    const [isActive2, setActive2] = useState(false);
    const classes = useStyles();
    const {usercolor, setUserColorValue} = useContext(myContext);
    const {userlettercolor, setUserLetterColor} = useContext(myContext);
    const {userbuttoncolor, setUserButtonColor} = useContext(myContext);
    const {featureclickedonmap, setFeatureclickedonmap} = useContext(myContext);
    

    const CardClicked = () => {
        setActive(!isActive);
    }
    const Card2Clicked = () => {
      setActive2(!isActive2);
    }
    const r = parseInt(usercolor.substr(1,2), 16)
    const g = parseInt(usercolor.substr(3,2), 16)
    const b = parseInt(usercolor.substr(5,2), 16)

    // let tableofclickedfeature;
   // if(featureclickedonmap !== null) tableofclickedfeature = featureclickedonmap.slice(1, -1);
    

    return (
  <div style={{height: !isActive ? '55%' : '95%'}} className={classes.root}>    
    <Card style={{backgroundColor: usercolor, color: userlettercolor}}>
        <CardMedia
          className={classes.media}
       //   image="../ship.png"
          title="Ship Info"
        > LAST POSITION INFO </CardMedia>
        <CardContent style={{height: !isActive ? '200px' : '400px', overflow: !isActive ? 'hidden' : 'visible'}}>   
          <div>
          {Parser(featureclickedonmap).slice(1, -1)}
          </div>
        </CardContent>
        <CardActionArea  onClick={CardClicked} style={{textAlign:"center",color:"inherit", height:"50px", fontSize:"20px", backgroundColor: userbuttoncolor}}>
        Enlarge
      </CardActionArea>
    </Card>
    
    <Card style={{backgroundColor: usercolor, color: userlettercolor}}>
        <CardMedia
          className={classes.media} 
         // image="./ship.png"
         // title="Ship Info"
         > STATISTICS </CardMedia>
        <CardContent style={{height: !isActive2 ? '200px' : '300px', overflow: !isActive2 ? 'hidden' : 'visible'}}>
          <div>
            STATS ...
            {/* [1,2,3].map(i => <div key={i}>{i}</div>) */}
          </div>
        </CardContent>
        <CardActionArea onClick={Card2Clicked} style={{textAlign:"center",color:"inherit", height:"50px", fontSize:"20px", backgroundColor: userbuttoncolor}}>
        Enlarge
      </CardActionArea>
    </Card>

  </div>
);

 
}


export default Info;


