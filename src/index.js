import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import Home from './scenes/home/index.js';
import './styles.css';
import 'font-awesome/css/font-awesome.min.css';
import 'highlightjs/styles/atom-one-dark.css';

ReactDOM.render((
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  ), document.getElementById('root'))