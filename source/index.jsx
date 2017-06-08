import React from 'react';
import ReactDom from 'react-dom';
import App from './container/App';

document.addEventListener('DOMContentLoaded', () => {
  history.replaceState('init', null, '#/');
  ReactDom.render(<App />, document.querySelector('.app'));
});
