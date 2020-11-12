import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import './LoadingScreen.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import MainScreen from '../MainScreen/MainScreen';
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles({
    button: {
     
      backgroundColor: '#4c6272',
      color: '#61dafb',
    
    },
  });


const LoadingScreen = props => {

    const classes = useStyles();
    const [isActive, setActive] = useState(false);

    const StartButtonClicked = () => {
        setActive(!isActive);
    }
    
    return (
        <div>
            <div className="parent">
                {/*<div className={isActive ? classes.shipwheel : classes.shipwheelstopped}></div> */}
                {/*<div className={isActive ? "shipwheel" : ""}></div>*/}
                    <Button href="/view" variant="contained" color="primary" className={classes.button} size="large" onClick={StartButtonClicked}>
                        Start
                    </Button>
            </div>
            <div className={isActive ? "wave" : ""}></div>

            <Router>
                <Route path="/view" exact={true} component={MainScreen}/>  
            </Router>

        </div>
      );

 
}


/*
function LoadingScreen() {
    return (
        <div>
            <Button variant="contained" color="primary">
                Hello World
            </Button>
        </div>
  
    );
}
*/

export default LoadingScreen;