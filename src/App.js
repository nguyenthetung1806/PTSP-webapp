import React, { Component } from 'react';
import axios from './axios';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

import Index from './components/Index'
import { BrowserRouter, Route } from "react-router-dom";




class App extends Component {
  constructor(props) {
    super();
    this.state = {};
  }
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route
            exact
            path="/"
            render={props => {
              return < Index />
            }}
          />

        </div>
      </BrowserRouter>
    );
  }
}

export default App;




