import React, { useState, createContext, useContext } from 'react';
import clsx from 'clsx';
import { makeStyles, Drawer, Button, List, Divider, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, IconButton, Typography, InputBase, createStyles, fade, Theme, Switch } from '@material-ui/core';
import { DirectionsBoat, Equalizer, Info, Person } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ChangeThemeColor, {themeColorsContext} from '../ChangeThemeColor/ChangeThemeColor';


const useStylesForNavBar = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
      color: '#61dafb'
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }),
);


const useStyles = makeStyles({
    list: {
      width: 250,
      backgroundColor: '#2b3740',
      color: '#61dafb'
    //  "&:hover": { backgroundColor: '#131a20' }

    },
    fullList: {
      width: 'auto',
      height: '100%',
      backgroundColor: '#2b3740',
      color: '#61dafb'
    },
    themeon: {
        display: "block",
    },
    themeoff: {
        display: "none",
    },
  });

const Anchor = 'left';

const TheNavBar = props => {
  const {userbuttoncolor, setUserButtonColor} = useContext(themeColorsContext);
  const {usercolor, setUserColorValue} = useContext(themeColorsContext);
  //const {userlettercolor, setUserLetterColorValue} = useContext(lettersthemecolorContext);
  const {userlettercolor, setUserLetterColor} = useContext(themeColorsContext);
  const [isActive, setActive] = useState(false);

  const [switchstate, setStateswitch] = useState({
    checked: false,
  });

  const ChangeThemeButtonClicked = (event) => {
    setStateswitch({ ...switchstate, [event.target.name]: event.target.checked });
    setActive(!isActive);
  }

  const classesForNavBar = useStylesForNavBar();

  const classes = useStyles();
  const [state, setState] = React.useState({ left: false });

  const toggleDrawer = (anchor, open) => ( event ) => {
    if ( event.type === 'keydown' && ((event).key === 'Tab' || (event).key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'left',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      style={{backgroundColor: usercolor}}
    >
      <List style={{marginTop: '90px', backgroundColor: usercolor, color: userlettercolor}}>
        {['Search Ship', 'Stats'].map((text, index) => (
          <ListItem button key={text} >
            <ListItemIcon>{index === 0 ? <DirectionsBoat /> : <Equalizer />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List style={{color: userlettercolor}}>
        {['About', 'Contact Us'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index === 0 ? <Info /> : <Person />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
   

          <div className={classesForNavBar.root}>
              <AppBar position="static" style={{backgroundColor: usercolor}}>
                  <Toolbar>
                      <IconButton onClick={toggleDrawer('left', true)}
                          edge="start"
                          className={classesForNavBar.menuButton}
                          color="inherit"
                          aria-label="open drawer"
                      >
                          <MenuIcon/>
                      </IconButton>
                      <Typography className={classesForNavBar.title} variant="h6" noWrap style={{color: userlettercolor}}>
                                                   Ships Tracking
                      </Typography>
                      <div className={classesForNavBar.search}>
                          <div className={classesForNavBar.searchIcon}>
                              <SearchIcon />
                          </div>
                          <InputBase
                              placeholder="Search…"
                              classes={{
                                  root: classesForNavBar.inputRoot,
                                  input: classesForNavBar.inputInput,
                              }}
                              inputProps={{ 'aria-label': 'search' }} />
                      </div>

                      <Switch
                        checked={switchstate.checked}
                        onChange={ChangeThemeButtonClicked}
                        color="primary"
                        name="checked"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                    <div className={isActive ? classes.themeon : classes.themeoff}>
                      <ChangeThemeColor />
                    </div>
                  </Toolbar>
        
              </AppBar>
              <Drawer anchor={'left'} open={state['left']} onClose={toggleDrawer('left', false)}>
                  {list('left')}
              </Drawer>
      </div>

   
          
      
     
  

  );
}




export default TheNavBar;