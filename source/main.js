//
// Renderer
'use strict';
//
// Vendor
import React from 'react';
import ReactDom from 'react-dom';
//
// Lib
import App from './container/App.js';

document.addEventListener("DOMContentLoaded", ()=> {
  ReactDom.render(
    <App/>,
    document.querySelector('.app')
  )
})
