import React, { useState, useContext } from 'react';
import { Card, makeStyles, CardActionArea, CardActions, CardContent, CardMedia, Typography, Button } from '@material-ui/core';
import { Frame, Stack } from "framer";
import ChangeThemeColor, {myContext} from '../ChangeThemeColor/ChangeThemeColor';


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
      height: 140,
    }
  });

const Info = props => {

    const [isActive, setActive] = useState(false);
    const classes = useStyles();
    const {usercolor, setUserColorValue} = useContext(myContext);
    const {userlettercolor, setUserLetterColor} = useContext(myContext);
    const {userbuttoncolor, setUserButtonColor} = useContext(myContext);
    const CardClicked = () => {
        setActive(!isActive);
    }
    const r = parseInt(usercolor.substr(1,2), 16)
    const g = parseInt(usercolor.substr(3,2), 16)
    const b = parseInt(usercolor.substr(5,2), 16)
    return (
  <div style={{height: '57%'}} className={classes.root}>    
    <Card style={{backgroundColor: usercolor, color: userlettercolor}}>
        <CardMedia
          className={classes.media}
          image="../ship.png"
          title="Ship Info"
        />
        <CardContent>   
          <div>
            INFO
            {/*[1,2,3].map(i => <div key={i}>{i}</div>)*/}
          </div>
        </CardContent>
        <CardActionArea  onClick={CardClicked} style={{textAlign:"center",color:"inherit", height:"50px", fontSize:"20px", backgroundColor: userbuttoncolor}}>
        Enlarge
      </CardActionArea>
    </Card>
    
    <Card style={{backgroundColor: usercolor, color: userlettercolor}}>
        <CardMedia
          className={classes.media} 
          image="./ship.png"
          title="Ship Info"
        />
        <CardContent>
          <div>
            STATS
            {/* [1,2,3].map(i => <div key={i}>{i}</div>) */}
          </div>
        </CardContent>
        <CardActionArea style={{textAlign:"center",color:"inherit", height:"50px", fontSize:"20px", backgroundColor: userbuttoncolor}}>
        Enlarge
      </CardActionArea>
    </Card>

  </div>
);

 
}


export default Info;


