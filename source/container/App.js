//
// Renderer
'use strict';
//
//
// Vendor
import React from 'react';
import { ipcRenderer, shell } from 'electron';
import { IndexRoute, Link, BrowserRouter, HashRouter, Route,  Switch, Redirect, browserHistory, matchPath } from 'react-router-dom';
import _u from 'lodash'
//
// Lib
import Store from '../models/TextLoadableJsonStore.js'
import EditorPage from './EditorPage.js'
import ListPage from './ListPage.js'
import QR from './QR.js'
import Help from './Help.js'
import Config from './Config.js'
import ConfigManager from '../models/ConfigManager.js'

const TREE_MIN_WIDTH = 180
const store = new Store()
const configManager = new ConfigManager()

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
    let configs = configManager.load()
    this.state = {
      item: store.buildNewItem(),
      currentDir: '',
      isOpenTree: false,
      keyword: '',
      selectingText: '',
      qr: false,
      help: false,
      config: false,
      configs: configs,
      isShowCover: false,
      treeWidth: TREE_MIN_WIDTH
    }
    ipcRenderer.on('windowShow', ()=> {
      this.setState({isShowCover: false})
    })
    this.mem = {
      editorCursorPositions: {}
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
    document.addEventListener("keyup", this.nativeKeyup.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.nativeKeyEvent.bind(this));
    document.removeEventListener("keyup", this.nativeKeyup.bind(this));
  }

  nativeKeyup(e) {
    if(e.key === 'Alt') {
      this.setState({isShowCover: false})
    }
  }

  nativeKeyEvent(e, a) {

    switch(e.key) {
      case 'Escape':
        if(matchPath(this.history.location.pathname, {path: '/', exact: true})) {
          this.setState({keyword: ''})
          this.setState({currentDir: ''})
          this.setState({isOpenTree: false})
        }
        break;
      case 'Alt':
        this.setState({isShowCover: true})
        break;
      return;
    }

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
          this.refs.keyword.setSelectionRange(0 , 999999)
          this.refs.keyword.focus()
          break;
        case 'n':
          this.setState({item: store.buildNewItem()})
          this.history.push('/new')
          break;
        case 'Enter':
          if(matchPath(this.history.location.pathname, {path: '/', exact: true})) {
            this.moveEdit(this.state.item)
          } else {
            this.moveList()
          }
          break;
        return
      }
    }
  }

  moveList() {
    this.history.push(rootPath(this.state.keyword))
  }

  moveNew() {
    this.history.push('/new')
  }

  moveEdit(item) {
    this.history.push(`/edit/${item.id}`)
  }

  changeText(body, title) {
    let newItem = this.state.item
    newItem.contents = body
    newItem.path = title
    newItem.modified_at = new Date()
    this.setState({item: newItem})
    this.debounceSave(newItem)
  }

  quit() {
    if(!confirm('終了しますか？')) {
      return
    }
    ipcRenderer.send('quit')
  }
  closeHelp () {
  }
  updateKeyword(e) {
    let word = e.target.value
    this.setState({keyword: word})
    this.debounceUpdateKeyword(word)
  }

  backToAll() {
    this.setState({currentDir: ''})
  }

  changeDir(dir) {
    this.setState({isOpenTree: false })
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

  updateConfig(configs) {
    this.setState({ configs: configs })
    configManager.save(configs)
  }

  openConfig() {
    this.setState({ config: true })
  }

  closeConfig() {
    this.setState({ config: false })
  }

  openQR() {
    this.setState({ qr: true })
  }
  closeQR() {
    this.setState({ qr: false })
  }

  openHelp() {
    this.setState({ help: true })
  }

  closeHelp() {
    this.setState({ help: false })
  }

  moveEditorCursor(startPosition, endPosition) {
    this.mem.editorCursorPositions[this.state.item.id] = startPosition;
  }

  selectEditorContents(selectingText) {
    this.setState({selectingText: selectingText})
  }

  openLinkUrl(url) {
    shell.openExternal(url);
  }

  render() {
    let editorProps = {
      configs: this.state.configs,
      item: this.state.item,
      isEnableLink: this.state.isShowCover,
      startPosition: this.mem.editorCursorPositions[this.state.item.id],
      onMoveCursor: this.moveEditorCursor.bind(this),
      onClickLink: this.openLinkUrl.bind(this),
      onChange: this.changeText.bind(this),
      onSelectContents: this.selectEditorContents.bind(this)
    }
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
                <Route path='/(edit)?(new)?' >
                  <span className='header-title'>{this.state.item ? this.state.item.title() : ''}</span>
                </Route>
              </Switch>

              <ul className='header-group-right'>
              <Switch>
                <Route exact path='/' >
                  <div>
                    <li className='header-item'><a className='header-item-link' onClick={this.openConfig.bind(this)}><i className='fa fa-cog' /></a></li>
                    <li className='header-item'><a className='header-item-link' onClick={this.openHelp.bind(this)}><i className='fa fa-question-circle' /></a></li>
                    <li className='header-item'><a className='header-item-link' onClick={this.quit.bind(this)}><i className='fa fa-power-off' /></a></li>
                  </div>
                </Route>
                <Route path='/(edit)?(new)?' >
                  <div>
                    <li className='header-item'><a className='header-item-link' onClick={this.openQR.bind(this)}><i className='fa fa-qrcode' /></a></li>
                    <li className='header-item'><a className='header-item-link' onClick={this.openHelp.bind(this)}><i className='fa fa-question-circle' /></a></li>
                    <li className='header-item'><a className='header-item-link' onClick={this.quit.bind(this)}><i className='fa fa-power-off' /></a></li>
                  </div>
                </Route>
              </Switch>
              </ul>
            </div>

            <div className='content'>
              <Switch>
                <Route exact path='/edit/:id' render={(context)=>
                  <EditorPage {...context} {...editorProps} />
                }/>
                <Route exact path='/new' render={(context)=>
                  <EditorPage {...context} {...editorProps} />
                }/>
                <Route path='/' render={(context)=> {
                    let list = store.list(this.state.keyword, this.state.currentDir)
                    return (
                      <ListPage {...context} item={this.state.item} keyword={this.state.keyword} list={list}
                        configs={this.state.configs}
                        treeMinWidth={TREE_MIN_WIDTH}
                        treeWidth={this.state.treeWidth}
                        fulllist={store.list()}
                        isOpenTree={this.state.isOpenTree}
                        currentDir={this.state.currentDir}
                        onClickDir={this.changeDir.bind(this)}
                        onResizeTree={this.resizeTree.bind(this)}
                        onClickStar={this.toggleStar.bind(this)}
                        onClickClosePath={this.backToAll.bind(this)}
                      />
                    )
                  }
                }/>
                <Redirect from='*' to='/' />
              </Switch>
            </div>
            <Switch>
              <Route exact path='/' render={(context)=> {
                return (true || this.state.currentDir === '') ? null : <div className='footer-bar' onClick={this.backToAll.bind(this)} >Path: { this.state.currentDir } <i className='fa fa-times' /> </div>
              } }/>
            </Switch>
          </div>
        </HashRouter>
        { this.state.help   ? (<Help onClose={this.closeHelp.bind(this)}/>) : null }
        { this.state.config ? (<Config onChange={this.updateConfig.bind(this)} configs={this.state.configs} onClose={this.closeConfig.bind(this)}/>) : null }
        { this.state.qr     ? (<QR onClose={this.closeQR.bind(this)} value={this.state.selectingText}/>) : null }
        </div>
    )
  }
}
