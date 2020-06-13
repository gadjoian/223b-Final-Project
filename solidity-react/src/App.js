import React from 'react';
import {Route} from 'react-router-dom'
import Home from './Pages/Home.js'
import Admin from './Pages/Admin.js'
import Request from './Pages/Request.js'
import Transfer from './Pages/Transfer.js'
import MyArt from './Pages/MyArt.js'


class App extends React.Component {
  render () {
    return (
      <div>
        <Route exact path='/' component={Home}></Route>
        <Route exact path='/Admin' component={Admin}></Route>
        <Route exact path='/Request' component={Request}></Route>
        <Route exact path='/Transfer' component={Transfer}></Route>
        <Route exact path='/MyArt' component={MyArt}></Route>
        
      </div>
    );
  }
}

export default App;
