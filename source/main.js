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

  history.replaceState('test', null, '#/')
  window.addEventListener('popstate',function(e){
    console.log(location.hash);
  });

  ReactDom.render(
    <App/>,
    document.querySelector('.app')
  )
})
