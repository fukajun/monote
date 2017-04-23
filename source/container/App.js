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
  constructor(props) {
    super(props)
    this.debounceUpdateKeyword = _u.debounce((word)=> {
      this.history.replace(`/?word=${word}`)
    }, 300)
  }

  componentDidMount() {
    this.history = this.refs.router.history
    document.addEventListener("keydown", this.nativeKeyEvent.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.nativeKeyEvent.bind(this));
  }

  nativeKeyEvent(e) {
    if( e.metaKey || e.ctrlKey ) {
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

      if( e.key === 'f' ) {
        this.refs.keyword.focus()
      }
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
  updateKeyword(e) {
    this.debounceUpdateKeyword(e.target.value)
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
        <HashRouter ref='router'>
          <div>
            <div className='header'>
              <input ref='keyword' className='keyword' type='text' onChange={this.updateKeyword.bind(this)} />
              <ul className='header-group-left'>
                <Switch>
                   <Route exact path='/' render={()=> (<li className='header-item'><Link className='header-item-link' to='/new'>{'+'}</Link></li>) }/>
                   <Route exact path='/new' render={()=> (<li className='header-item'><Link className='header-item-link' to='/'>{'<'}</Link></li>) }/>
                   <Route exact path='/edit/:id' render={()=> (<li className='header-item'><Link className='header-item-link' to='/'>{'<'}</Link></li>) }/>
                </Switch>
              </ul>
              <ul className='header-group-right'>
                <li className='header-item'><a className='header-item-link' onClick={this.reload.bind(this)}><i className='flaticon-refresh' /></a></li>
                <li className='header-item'><a className='header-item-link' onClick={this.quit.bind(this)}><i className='flaticon-power-button' /></a></li>
              </ul>
            </div>
            <div className='content'>
              <Switch>
                <Route exact path='/edit/:id' component={EditorPage} />
                <Route exact path='/new' component={EditorPage} />
                <Route path='/' component={ListPage} />
                <Redirect from='*' to='/' />
              </Switch>
            </div>
          </div>
        </HashRouter>
        </div>
    )
  }
}
