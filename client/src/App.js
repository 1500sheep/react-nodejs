import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import header_img from './header_img.svg';
import { Link } from 'react-router-dom';
import M1 from './containers/M1';
import Login from './containers/Login';
import Register from './containers/Register';
import Main from './containers/Main';
import Search from './containers/Search';
import Upload from './containers/Upload';
import Profile from './containers/Profile';
import Comment from './containers/Comment';
import Like from './containers/Like';
import Tag from './containers/Tag';

import homeLogo from './containers/MainFiles/home.svg';
import homeLogo_black from './containers/MainFiles/home_black.svg';
import searchLogo from './containers/MainFiles/search.svg';
import searchLogo_blue from './containers/MainFiles/search_blue.svg';
import photoLogo from './containers/MainFiles/photo.svg';
import photoLogo_blue from './containers/MainFiles/photo_blue.svg';
import unlikeLogo from './containers/MainFiles/like.svg';
import likeLogo from './containers/MainFiles/like-2.svg';
import profileLogo from './containers/MainFiles/profile.svg'
import profileLogo_blue from './containers/MainFiles/profile_blue.svg'

import {getCookie} from "./common/utils";


class App extends Component {
    constructor(props){
        super(props)
        this.state={
            no_user:0
        }

    }

    componentDidMount(){
        const no_user = getCookie("no_user");
        this.setState({
            no_user:no_user
        })
    }

  render() {
      if(!this.state.no_user){
          return (
              <Router>
                  <div className="App-Rectangle">
                      <img src={header_img}/>
                      <Route exact path="/" component={M1}/>
                      <Route path="/login" component={Login}/>
                      <Route path="/register" component={Register}/>
                  </div>
              </Router>
          );
      }else{
          return (
              <Router>
                  <div className="App-Rectangle">
                      <img src={header_img}/>
                      <Route exact path="/" component={Main}/>
                      <Route path="/search" component={Search}/>
                      <Route path="/photo" component={Upload}/>
                      <Route path="/comment" component={Comment}/>
                      <Route path="/like" component={Like}/>
                      <Route path="/profile" component={Profile}/>
                      <Route path="/hashtag" component={Tag}/>
                      <Footer/>
                  </div>
              </Router>
          );
      }

  }
}

export default App;


class Footer extends Component {
    render(){
        console.log("history : ",window.location.pathname);
        return(
            <div className="App-Bar">
                    <Link to="/"><img src={window.location.pathname=='/'?homeLogo:homeLogo_black} className="App-Home"/></Link>
                    <Link to="/search"><img src={window.location.pathname=='/search'?searchLogo_blue:searchLogo} className="App-Search"/></Link>
                    <Link to="/photo"><img src={window.location.pathname=='/photo'?photoLogo_blue:photoLogo} className="App-Photo"/></Link>
                    <Link to="/like"><img src={window.location.pathname=='/like'?likeLogo:unlikeLogo} className="App-Activity"/></Link>
                    <Link to="/profile"><img src={window.location.pathname=='/profile'?profileLogo_blue:profileLogo} className="App-Profile"/></Link>
            </div>
        );
    }
}
