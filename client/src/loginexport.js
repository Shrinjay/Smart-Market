import React, { Component } from 'react';
import './App.css';

import Calendar from './Components/Calendar/';
import Login from './loginpage';
import SearchBar from './search';


const style = {
  position: "relative",
  margin: "50px auto"
}

class LoginPage extends Component {
  onDayClick = (e, day) => {
    alert(day);
  }
  
  render() {
    return (
      <div className="LoginPage">
      <h1>Welcome Back!</h1>
      <Login/>   
      </div>
    );
  }
}

export default LoginPage;