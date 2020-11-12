import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState, useMemo } from 'react';
import ChangeThemeColor, { myContext } from '../ChangeThemeColor/ChangeThemeColor';
import Info from '../Info/Info';
import Stats from '../Stats/Stats';
import TheMap from '../TheMap/TheMap';
import TheNavBar from '../TheNavBar/TheNavBar';
import ThreeDimensionalMode from '../ThreeDimensionalMode/ThreeDimensionalMode';
import Switch from '@material-ui/core/Switch';


const useStyles = makeStyles({
    root: {

      backgroundColor: '#4c6272',
      boxSizing: "border-box",
      margin: 0,
      padding: 0,
      height: "1000px"

    },
  //  themeon: {
   //     display: "block",
  //  },
  //  themeoff: {
  //      display: "none",
  //  },
});

const MainScreen = props => {

    const classes = useStyles();

    const [usercolor, setUserColorValue] = useState('#2b3740')
    const [userlettercolor, setUserLetterColor] = useState('#61dafb')
    const [userbuttoncolor, setUserButtonColor] = useState('#202930')
    const [featureclickedonmap, setFeatureclickedonmap] = useState('')
   // const [userlettercolor, setUserLetterColorValue] = useState('#61dafb')
    // useMemo xrisimopoieitai gt to component kanei polla renders mexri na oloklirothei to render tou kai
    // emeis theloume mono otan exoume allagi sto [usercolorvalue, userSetColorValue] na perniountai sto
    // value  tou themeColorsContext.Provider oi allages sta {usercolorvalue, userSetColorValue}
    // diladi theloume oi times edo --> <themeColorsContext.Provider value={{usercolorvalue, userSetColorValue}}>
    // na enimeronontai mono otan allazei kapoio apo ta [usercolorvalue, userSetColorValue] kai oxi se kathe allagi
    // pou kanei to component na rendarontai ksana kai auta...
  const providerValue = useMemo(() => ({usercolor, setUserColorValue, userlettercolor, setUserLetterColor, userbuttoncolor, setUserButtonColor, featureclickedonmap, setFeatureclickedonmap}), [usercolor, setUserColorValue, userlettercolor, setUserLetterColor, userbuttoncolor, setUserButtonColor, featureclickedonmap, setFeatureclickedonmap]);
  //const providerValue2 = useMemo(() => ({userlettercolor, setUserLetterColorValue}), [userlettercolor, setUserLetterColorValue]);
 
  //  const [state, setState] = useState({
   //     checked: false,
   //   });
  //  const [isActive, setActive] = useState(false);

  //  const ChangeThemeButtonClicked = (event: React.ChangeEvent<HTMLInputElement>) => {
   //     setState({ ...state, [event.target.name]: event.target.checked });
   //     setActive(!isActive);
  //  }

  const r = parseInt(usercolor.substr(1,2), 16) // convert hex color value to rgb so to pass inside rgba() css function
  const g = parseInt(usercolor.substr(3,2), 16)
  const b = parseInt(usercolor.substr(5,2), 16)
    return (
        <div className={classes.root} style={{backgroundColor: r <= 126 ? 'rgba('+r+','+g+','+b+','+'0.8)' : 'rgba('+r+','+g+','+b+','+'0.4)'}}>
          <myContext.Provider value={providerValue}>
            <TheNavBar />            
            <Info />
            <TheMap/>
          </myContext.Provider>
          
            {/*<Stats /> */ }
            {/*<ThreeDimensionalMode />*/ }
           {/* <div className={isActive ? classes.themeon : classes.themeoff}>*/}
            {/* <ChangeThemeColor />*/}
           {/* </div>*/}

           
     {/* <Switch
        checked={state.checked}
        onChange={ChangeThemeButtonClicked}
        color="primary"
        name="checked"
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />*/}
        </div>
    );
}




export default MainScreen;
