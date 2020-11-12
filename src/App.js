import React from 'react';
import './App.css';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import MainScreen from './components/MainScreen/MainScreen';


function App() {



  

  return (
    // Try changing to animationHasFinished={true}:
    <div>
      <Router>
        <Switch>
          <Route path="/" exact={true} component={LoadingScreen}/>
          <Route path="/view" exact={true} component={MainScreen}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
