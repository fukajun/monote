//
// Renderer
'use strict';
//
//
// Vendor
import React from 'react';
import { ipcRenderer } from 'electron';
import { IndexRoute, Link, BrowserRouter, HashRouter, Route,  Switch, Redirect, browserHistory, matchPath } from 'react-router-dom';
import _u from 'underscore'
//
// Lib
import Store from '../models/JsonStore.js'
import EditorPage from './EditorPage.js'
import ListPage from './ListPage.js'

const store = new Store()

// TODO: To helper
function rootPath(word = '') {
  return (word.length == 0 ? '/' : `/?word=${word}`)
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      item: null,
      keyword: ''
    }
    this.debounceUpdateKeyword = _u.debounce((word)=> {
      this.history.replace(rootPath(word))
    }, 300)
    this.debounceSave = _u.debounce((item)=> {
      store.store(item)
    }, 300)
  }

  componentDidMount() {
    this.history = this.refs.router.history
    this.history.listen((location)=> {
      let context
      if (context = matchPath(location.pathname, {path: '/edit/:id', exact: true})) {
        console.log(context.params.id)
        this.setState({item: store.load(context.params.id)})
      } else if (context = matchPath(location.pathname, {path: '/new'})) {
        this.setState({item: store.buildNewItem()})
      }
    })
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
        this.history.replace('/')
        this.setState({keyword: ''})
        this.refs.keyword.focus()
      }
      if(e.key === 'n') {
        this.history.push('/new')
      }
      if( e.key === 'Enter' ) {
        this.history.replace(rootPath(this.state.keyword))
      }
    }
  }
  moveList() {
    this.history.push('/')
  }

  moveNew() {
    this.history.push('/new')
  }

  changeText(body) {
    let newItem = this.state.item
    newItem.contents = body
    this.setState({item: newItem})
    this.debounceSave(newItem)
  }

  quit() {
    if(!confirm('終了しますか？')) {
      return
    }
    ipcRenderer.send('quit')
  }

  updateKeyword(e) {
    let word = e.target.value
    this.setState({keyword: word})
    this.debounceUpdateKeyword(word)
  }

  reload() {
    if(!confirm('リロードしますか？')) {
      return
    }
    ipcRenderer.send('reload')
  }

  render() {
    return (
      <div>
        <HashRouter ref='router'>
          <div>
            <div className='header'>
              <ul className='header-group-left'>
                <Switch>
                  <Route exact path='/' >
                    <li className='header-item'><Link className='header-item-link' to='/new'>{'+'}</Link></li>
                  </Route>
                  <Route path='/*'>
                    <li className='header-item'><Link className='header-item-link' to={rootPath(this.state.keyword)}>{'<'}</Link></li>
                  </Route>
                </Switch>
              </ul>

              <Switch>
                <Route exact path='/' >
                  <input ref='keyword' className='keyword' type='text' onChange={this.updateKeyword.bind(this)} value={this.state.keyword}/>
                </Route>
                <Route path='/edit' >
                  <span className='header-title'>{this.state.item ? this.state.item.title() : ''}</span>
                </Route>
                <Route path='/new' >
                  <span className='header-title'>{this.state.item ? this.state.item.title() : ''}</span>
                </Route>
              </Switch>

              <ul className='header-group-right'>
                <li className='header-item'><a className='header-item-link' onClick={this.reload.bind(this)}><i className='flaticon-refresh' /></a></li>
                <li className='header-item'><a className='header-item-link' onClick={this.quit.bind(this)}><i className='flaticon-power-button' /></a></li>
              </ul>
            </div>

            <div className='content'>
              <Switch>
                <Route exact path='/edit/:id' render={(context)=>
                  <EditorPage {...context} item={this.state.item} onChange={this.changeText.bind(this)} />}
                />
                <Route exact path='/new' render={(context)=>
                  <EditorPage {...context} item={this.state.item} onChange={this.changeText.bind(this)} />}
                />
                <Route path='/' render={(context)=>
                  <ListPage {...context} item={this.state.item}/>}
                />
                <Redirect from='*' to='/' />
              </Switch>
            </div>
          </div>
        </HashRouter>
        </div>
    )
  }
}
