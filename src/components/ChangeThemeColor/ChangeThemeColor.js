import React, {createContext, useContext, useEffect} from 'react';
import { ThemeProvider, useTheme, makeStyles, createStyles } from '@material-ui/core/styles';
import MainScreen from '../MainScreen/MainScreen';
import { Button } from '@material-ui/core';
/*
var MyTheme = {
  color: string,
}

var ComponentProps = {
  backgroundColor: string,
}
*/
export const myContext = createContext();
//export const lettersthemecolorContext = createContext('#61dafb');

const useStylesForTheme = makeStyles((theme) =>
  createStyles({
    root: (props) => ({
      backgroundColor: props.backgroundColor,
      color: theme.color,
    }),
  }),

);

const useStyles = makeStyles({
  resetbutton: {
   
    backgroundColor: '#38444d',
    color: '#61dafb',
    border: 'none',
    padding: '10px 15px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    outline: 'none',
    "&:active": { backgroundColor: '#131a20' }
  
  },
});
export default function ChangeThemeColor() {
  const classes = useStyles();

  const {usercolor, setUserColorValue} = useContext(myContext);
  const {userlettercolor, setUserLetterColor} = useContext(myContext);
  const {userbuttoncolor, setUserButtonColor} = useContext(myContext);
 // const {userlettercolor, setUserLetterColorValue} = useContext(lettersthemecolorContext);

  const [backgroundColor, setBackgroundColor] = React.useState('#2b3740');
  const handleBackgroundColorChange = (event) => {
    setBackgroundColor(event.target.value);
    setUserColorValue(backgroundColor )
  };

  const [color, setColor] = React.useState('#61dafb');
  const handleColorChange = (event) => {
    setColor(event.target.value); // show changes to color value inside color input dynamically...
   // setUserColorValue(color) 
    setUserLetterColor(color) // change the theme back color ... this uses the context so all components receive the new value
  
  };

  const [bcolor, setbColor] = React.useState('#202930');
  const handleButtonsColorChange = (event) => {
    setbColor(event.target.value); // change the value that is being displayed inside the input color field
    setUserButtonColor(bcolor); // update the context with that new color value so this value can be passed to all components that has registered to this context here
  }


  const resetColors = () => {
    setBackgroundColor('#2b3740');
    setColor('#61dafb'); 
    setUserColorValue('#2b3740'); 
    setUserLetterColor('#61dafb');
    setUserButtonColor('#38444d');
  };

 



  const theme = React.useMemo(() => ({ color }), [color]);

  return (
    <ThemeProvider theme={theme}>
      <div>
    
          <div>
            <label htmlFor="color" style={{color: userlettercolor}}>foreground color: </label>
            <input id="color" type="color" onChange={handleColorChange} value={color} />
        
            <label htmlFor="background-color" style={{color: userlettercolor}}>background color: </label>
            <input id="background-color" type="color" onChange={handleBackgroundColorChange} value={backgroundColor} />
          
            <label htmlFor="buttons-color" style={{color: userlettercolor}}>button color: </label>
            <input id="buttons-color" type="color" onChange={handleButtonsColorChange} value={backgroundColor} />
          
            
            <input style={{color: userlettercolor, backgroundColor: userbuttoncolor}} className={classes.resetbutton} id="reset-colors" type="button" onClick={resetColors} value="Reset Colors" />
                   
          </div>
  
      </div>
    </ThemeProvider>
  );
}