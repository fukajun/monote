//
// Renderer
'use strict';
//
//
// Vendor
import React from 'react';
import { ipcRenderer } from 'electron';
import { IndexRoute, Link, BrowserRouter, HashRouter, Route,  Switch, Redirect, browserHistory } from 'react-router-dom';
import _u from 'underscore'
//
// Lib
import Store from '../models/Store.js'
import EditorPage from './EditorPage.js'
import ListPage from './ListPage.js'

const store = new Store()
export default class App extends React.Component {

  componentDidMount() {
    this.history = this.refs.router.history
    document.addEventListener("keydown", this.nativeKeyEvent.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.nativeKeyEvent.bind(this));
  }

  nativeKeyEvent(e) {
    if( e.key >= '0' && e.key <= '9' ) {
      let i = e.key
      let item = store.list()[i]
      if( !item ) {
        return
      }

      // NOTE: Protect input number to textarea after move page.
      let delay = 100
      setTimeout(()=> {
        this.history.replace(`/edit/${item.id}`);
      }, delay);
    }

    if( e.metaKey || e.ctrlKey ) {
      if(e.key === 'n') {
        this.history.push('/new')
      }
      if( e.key === 'Enter' ) {
        this.history.replace('/')
      }
    }
  }
  moveList() {
    this.history.push('/')
  }

  moveNew() {
    this.history.push('/new')
  }

  quit() {
    if(!confirm('終了しますか？')) {
      return
    }
    ipcRenderer.send('quit')
  }

  reload() {
    if(!confirm('リロードしますか？')) {
      return
    }
    ipcRenderer.send('reload')
  }

  //{ location.hash === '#/' ? (<a onClick={this.moveNew.bind(this)}>New</a>) : (<a onClick={this.moveList.bind(this)}>Back</a>) }
  render() {
    console.log(location)
    return (
      <div>
        <div className='header'>
          <i onClick={this.reload.bind(this)} className='flaticon-refresh'></i>
          <i onClick={this.quit.bind(this)} className='flaticon-power-button'></i>
        </div>
        <div className='content'>
        <HashRouter ref='router'>
          <Switch>

            <Route exact path='/edit/:id' component={EditorPage} />
            <Route exact path='/new' component={EditorPage} />
            <Route path='/' component={ListPage} />
            <Redirect from='*' to='/' />
          </Switch>
        </HashRouter>
        </div>
      </div>
    )
  }
}
