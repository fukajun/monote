//
// Renderer
'use strict';
//
//
// Vendor
import React from 'react';
import { ipcRenderer } from 'electron';
import { IndexRoute, Link, BrowserRouter, HashRouter, Route,  Switch, Redirect, browserHistory, matchPath } from 'react-router-dom';
import _u from 'lodash'
//
// Lib
import Store from '../models/TextLoadableJsonStore.js'
import EditorPage from './EditorPage.js'
import ListPage from './ListPage.js'

const TREE_MIN_WIDTH = 200
const store = new Store()

// TODO: To helper
function rootPath(word = '') {
  return (word.length == 0 ? '/' : `/?word=${word}`)
}

function currentItemPath(path) {
  return ((path[path.length - 1] || '').match(/^\/?$/) ? '' : `${path}/`)
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      item: store.buildNewItem(),
      currentDir: '',
      isOpenTree: false,
      keyword: '',
      treeWidth: TREE_MIN_WIDTH
    }
    this.debounceUpdateKeyword = _u.debounce((word)=> {
      this.setState({keyword: word})
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
        this.setState({item: store.load(context.params.id)})
      }else if (context = matchPath(location.pathname, {path: '/new', exact: true})) {
        this.setState({item: store.buildNewItem({ path: currentItemPath(this.state.currentDir) })})
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
        let item = store.list(this.state.keyword, this.state.currentDir)[i]
        if( !item ) {
          return
        }

        // NOTE: Protect input number to textarea after move page.
        let delay = 100
        setTimeout(()=> {
          this.setState({item: item})
          this.history.replace(`/edit/${item.id}`);
        }, delay);
        return
      }

      switch(e.key) {
        case 'i':
          this.toggleTree()
          break;
        case 'f':
          this.history.replace('/')
          this.setState({keyword: ''})
          this.refs.keyword.focus()
          break;
        case 'n':
          this.setState({item: store.buildNewItem()})
          this.history.push('/new')
          break;
        case 'Enter':
          this.history.replace(rootPath(this.state.keyword))
          break;
      }
    }
  }
  moveList() {
    this.history.push('/')
  }

  moveNew() {
    this.history.push('/new')
  }

  changeText(body, title) {
    let newItem = this.state.item
    newItem.contents = body
    newItem.path = title
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

  changeDir(dir) {
    this.setState({currentDir: dir})
  }

  toggleTree() {
    this.setState({isOpenTree: !this.state.isOpenTree})
  }

  resizeTree(width) {
    if(width >= TREE_MIN_WIDTH) {
      this.setState({treeWidth: width})
    }
  }

  toggleStar(id) {
    let item = store.load(id)
    item.pin = !item.pin
    store.save(item)
    this.setState({item: item})
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
                    <div>
                    <li className='header-item'><a className='header-item-link' onClick={this.toggleTree.bind(this)} ><i className='fa fa-bars' /></a></li>
                    <li className='header-item'><Link className='header-item-link' to='/new'><i className='fa fa-plus' /></Link></li>
                    </div>
                  </Route>
                  <Route path='/*'>
                    <li className='header-item'><Link className='header-item-link' to={rootPath(this.state.keyword)}><i className='fa fa-chevron-left' /></Link></li>
                  </Route>
                </Switch>
              </ul>

              <Switch>
                <Route exact path='/' >
                  <input ref='keyword' className='keyword' type='text' placeholder={'keyword'} onChange={this.updateKeyword.bind(this)} value={this.state.keyword}/>
                </Route>
                <Route path='/edit' >
                  <span className='header-title'>{this.state.item ? this.state.item.title() : ''}</span>
                </Route>
                <Route path='/new' >
                  <span className='header-title'>{this.state.item ? this.state.item.title() : ''}</span>
                </Route>
              </Switch>

              <ul className='header-group-right'>
                <li className='header-item'><a className='header-item-link' onClick={this.reload.bind(this)}><i className='fa fa-refresh' /></a></li>
                <li className='header-item'><a className='header-item-link' onClick={this.quit.bind(this)}><i className='fa fa-power-off' /></a></li>
              </ul>
            </div>

            <div className='content'>
              <Switch>
                <Route exact path='/edit/:id' render={(context)=>
                  <EditorPage {...context} item={this.state.item} onChange={this.changeText.bind(this)} />
                }/>
                <Route exact path='/new' render={(context)=>
                  <EditorPage {...context} item={this.state.item} onChange={this.changeText.bind(this)} />
                }/>
                <Route path='/' render={(context)=> {
                    let list = store.list(this.state.keyword, this.state.currentDir)
                    return (
                      <ListPage {...context} item={this.state.item} keyword={this.state.keyword} list={list}
                        treeMinWidth={TREE_MIN_WIDTH}
                        treeWidth={this.state.treeWidth}
                        fulllist={store.list()}
                        isOpenTree={this.state.isOpenTree}
                        currentDir={this.state.currentDir}
                        onClickDir={this.changeDir.bind(this)}
                        onResizeTree={this.resizeTree.bind(this)}
                        onClickStar={this.toggleStar.bind(this)}
                      />
                    )
                  }
                }/>
                <Redirect from='*' to='/' />
              </Switch>
            </div>
          </div>
        </HashRouter>
        </div>
    )
  }
}
