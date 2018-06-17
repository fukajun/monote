import React from 'react';
import { ipcRenderer, shell } from 'electron';
import { IndexRoute, Link, BrowserRouter, HashRouter, Route, Switch, Redirect, browserHistory, matchPath } from 'react-router-dom';
import _u from 'lodash';

import Store from '../models/TextLoadableJsonStore';
import MemoryStore from '../models/MemoryStore';
import EditorPage from './EditorPage';
import ListPage from './ListPage';
import QRWindow from '../components/QRWindow';
import HelpWindow from '../components/HelpWindow';
import InputWindow from '../components/InputWindow';
import ConfigWindow from '../components/ConfigWindow';
import ConfigManager from '../models/ConfigManager';

const TREE_MIN_WIDTH = 180;
const store = new Store();
const memoryStore = new MemoryStore(store);
const configManager = new ConfigManager();

// TODO: To helper
function rootPath(word = '') {
  return (word.length === 0 ? '/' : `/?word=${word}`);
}

function currentItemPath(path) {
  return ((path[path.length - 1] || '').match(/^\/?$/) ? '' : `${path}/`);
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    const configs = configManager.load();
    this.state = {
      configs,
      item: memoryStore.buildNewItem(),
      currentDir: '',
      currentPath: '',
      isOpenTree: false,
      keyword: '',
      selectingText: '',
      qr: false,
      help: false,
      config: false,
      isShowCover: false,
      isShowInput: false,
      treeWidth: TREE_MIN_WIDTH,
    };
    ipcRenderer.on('windowShow', () => {
      this.hideCover();
    });
    this.mem = {
      editorCursorPositions: {},
      itemHistories: [],
      itemIndex: 0,
    };
    this.debounceUpdateKeyword = _u.debounce((word) => {
      this.searchNotes(word)
    }, 300);
    this.debounceSave = _u.debounce((item) => {
      memoryStore.store(item);
    }, 300);

    this.updateConfig = this.updateConfig.bind(this);
    this.closeConfig = this.closeConfig.bind(this);
    this.openInput = this.openInput.bind(this);
    this.closeInput = this.closeInput.bind(this);
    this.submitInput = this.submitInput.bind(this);
    this.closeQR = this.closeQR.bind(this);
    this.closeHelp = this.closeHelp.bind(this);
    this.backToAll = this.backToAll.bind(this);
    this.changeDir = this.changeDir.bind(this);
    this.resizeTree = this.resizeTree.bind(this);
    this.toggleStar = this.toggleStar.bind(this);
    this.toggleArchiveMemo = this.toggleArchiveMemo.bind(this);
  }

  openPrevHistoryItem() {
    this.mem.itemIndex = (this.mem.itemIndex - 1) >= 0 ? this.mem.itemIndex - 1 : 0;
    const item = this.mem.itemHistories[this.mem.itemIndex];
    this.moveEdit(item);
  }

  openNextHistoryItem() {
    this.mem.itemIndex = (this.mem.itemIndex + 1) < this.mem.itemHistories.length ? this.mem.itemIndex + 1 : this.mem.itemHistories.length - 1;
    const item = this.mem.itemHistories[this.mem.itemIndex];
    this.moveEdit(item);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.nativeKeyDown.bind(this));
    document.addEventListener('keyup', this.nativeKeyup.bind(this));

    this.history = this.refs.router.history;
    this.history.listen((location) => {
      let context;
      if (context = matchPath(location.pathname, { path: '/edit/:id', exact: true })) {
        const item = memoryStore.load(context.params.id)
        if(location.search.length === 0) {
          this.mem.itemIndex = this.mem.itemHistories.length - 1
          this.mem.itemHistories.push(item)
        }
        this.setState({ item:  item });
      } else if (context = matchPath(location.pathname, { path: '/new', exact: true })) {
        this.setState({ item: store.buildNewItem({ path: currentItemPath(this.state.currentDir) }) });
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.nativeKeyDown.bind(this));
    document.removeEventListener('keyup', this.nativeKeyup.bind(this));
  }

  nativeKeyup(e) {
    if (e.key === 'Alt') {
      this.hideCover();
      return;
    }
  }

  nativeKeyDown(e) {
    if (e.key === 'Alt') {
      this.showCover();
      return;
    }

    // For command + options
    if (e.metaKey && e.altKey) {
      switch (e.key) {
        case 'ArrowLeft':
          this.openPrevHistoryItem()
          break;
        case 'ArrowRight':
          this.openNextHistoryItem()
          break;
      }
      return;
    }

    // For command
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          const item = memoryStore.list(this.state.keyword, this.state.currentDir)[e.key];
          if (!item) { return; }
          // NOTE: Protect entering number in textarea after moving edit page.
          setTimeout(() => this.moveEdit(item), 100);
          break;
        case 't':
          this.toggleTree();
          break;
        case 'f':
          this.history.replace('/');
          this.refs.keyword.setSelectionRange(0, 999999);
          this.refs.keyword.focus();
          break;
        case 'n':
          let newItem = memoryStore.buildNewItem()
          this.setState({ item: newItem });
          memoryStore.save(newItem)
          this.history.push('/new');
          break;
        case 'Enter':
          if (matchPath(this.history.location.pathname, { path: '/', exact: true })) {
            this.moveEdit(this.state.item);
          } else {
            this.moveList();
          }
          break;
      }
    }
  }

  //
  // Actions
  searchNotes(word) {
    // TODO: setState notes
    this.setState({ keyword: word });
  }

  moveList() {
    this.history.push(rootPath(this.state.keyword));
  }

  moveNew() {
    this.history.push('/new');
  }

  moveEdit(item) {
    this.history.push(`/edit/${item.id}`);
  }

  toggleArchiveMemo(item) {
    let newItem = item;
    newItem.archived_at = newItem.archived_at ?  null : new Date();
    memoryStore.store(newItem);
    this.setState({ keyword: this.state.keyword });
  }

  hideCover() {
    this.setState({ isShowCover: false });
  }

  showCover() {
    this.setState({ isShowCover: true });
  }

  changeText(body, title) {
    let newItem = this.state.item;
    newItem.contents = body;
    newItem.path = title;
    newItem.modified_at = new Date();
    this.setState({ item: newItem });
    this.debounceSave(newItem);
  }

  quit() {
    if (!confirm('終了しますか？')) {
      return;
    }
    ipcRenderer.send('quit');
  }

  updateKeyword(e) {
    const word = e.target.value;
    this.setState({ keyword: word });
    this.debounceUpdateKeyword(word);
  }

  backToAll() {
    this.setState({ currentDir: '' });
  }

  changeDir(dir) {
    this.setState({ isOpenTree: false });
    this.setState({ currentDir: dir });
  }

  toggleTree() {
    this.setState({ isOpenTree: !this.state.isOpenTree });
  }

  resizeTree(width) {
    if (width >= TREE_MIN_WIDTH) {
      this.setState({ treeWidth: width });
    }
  }

  toggleStar(id) {
    const item = memoryStore.load(id);
    item.pin = !item.pin;
    memoryStore.save(item);
    this.setState({ item });
  }

  updateConfig(configs) {
    this.setState({ configs });
    configManager.save(configs);
  }

  openConfig() {
    this.setState({ config: true });
  }

  closeConfig() {
    this.setState({ config: false });
  }

  submitInput(newPath) {
    let list = memoryStore.changeDirPath(this.state.currentPath, newPath);
    this.setState({ isShowInput: false });
  }

  openInput(targetPath) {
    this.setState({ currentPath: targetPath });
    this.setState({ isShowInput: true });
  }

  closeInput() {
    this.setState({ isShowInput: false });
  }

  openQR() {
    this.setState({ qr: true });
  }
  closeQR() {
    this.setState({ qr: false });
  }

  openHelp() {
    this.setState({ help: true });
  }

  closeHelp() {
    this.setState({ help: false });
  }

  moveEditorCursor(startPosition, endPosition) {
    this.mem.editorCursorPositions[this.state.item.id] = startPosition;
  }

  selectEditorContents(selectingText) {
    this.setState({ selectingText });
  }

  openLinkUrl(url) {
    shell.openExternal(url);
  }

  openLinkItem(str) {
    // TODO: find item
    const id = str.replace(/..*#/, '')
    console.log(`#${id}#`)
    this.moveEdit({id: id})
  }

  openLinkNewItem(str) {
    const item = memoryStore.buildNewItem({ path: currentItemPath(this.state.currentDir) });
    let fromItem = this.state.item;
    item.contents = `${fromItem.title()}から`;
    memoryStore.store(item);
    fromItem.contents = fromItem.contents.replace('#new', `#${item.id}`);
    momoryStore.store(fromItem);
    this.moveEdit({id: item.id})
  }

  render() {
    const editorProps = {
      configs: this.state.configs,
      item: this.state.item,
      isEnableLink: this.state.isShowCover,
      startPosition: this.mem.editorCursorPositions[this.state.item.id],
      onMoveCursor: this.moveEditorCursor.bind(this),
      onClickLink: this.openLinkUrl.bind(this),
      onClickIdLink: this.openLinkItem.bind(this),
      onClickNewLink: this.openLinkNewItem.bind(this),
      onChange: this.changeText.bind(this),
      onSelectContents: this.selectEditorContents.bind(this),
    };
    return (
      <div>
        <HashRouter ref="router">
          <div>
            <div className="header">
              <ul className="header-group-left">
                <Switch>
                  <Route exact path="/" >
                    <div>
                      <li className="header-item"><a className="header-item-link" onClick={this.toggleTree.bind(this)} ><i className="fa fa-bars" /></a></li>
                      <li className="header-item"><Link className="header-item-link" to="/new"><i className="fa fa-plus" /></Link></li>
                    </div>
                  </Route>
                  <Route path="/*">
                    <li className="header-item"><Link className="header-item-link" to={rootPath(this.state.keyword)}><i className="fa fa-chevron-left" /></Link></li>
                  </Route>
                </Switch>
              </ul>

              <Switch>
                <Route exact path="/" >
                  <input ref="keyword" className="keyword" type="text" placeholder={'keyword'} onChange={this.updateKeyword.bind(this)} value={this.state.keyword} />
                </Route>
                <Route path="/(edit)?(new)?" >
                  <span className="header-title">{this.state.item ? `${this.state.item.title()} ( ${this.state.item.id} )` : ''}</span>
                </Route>
              </Switch>

              <ul className="header-group-right">
                <Switch>
                  <Route exact path="/" >
                    <div>
                      <li className="header-item"><a className="header-item-link" onClick={this.openConfig.bind(this)}><i className="fa fa-cog" /></a></li>
                      <li className="header-item"><a className="header-item-link" onClick={this.openHelp.bind(this)}><i className="fa fa-question-circle" /></a></li>
                      <li className="header-item"><a className="header-item-link" onClick={this.quit.bind(this)}><i className="fa fa-power-off" /></a></li>
                    </div>
                  </Route>
                  <Route path="/(edit)?(new)?" >
                    <div>
                      <li className="header-item"><a className="header-item-link" onClick={this.openQR.bind(this)}><i className="fa fa-qrcode" /></a></li>
                      <li className="header-item"><a className="header-item-link" onClick={this.openHelp.bind(this)}><i className="fa fa-question-circle" /></a></li>
                      <li className="header-item"><a className="header-item-link" onClick={this.quit.bind(this)}><i className="fa fa-power-off" /></a></li>
                    </div>
                  </Route>
                </Switch>
              </ul>
            </div>

            <div className="content">
              <Switch>
                <Route
                  exact
                  path="/edit/:id"
                  render={context => <EditorPage {...context} {...editorProps} />}
                />
                <Route
                  exact
                  path="/new"
                  render={context => <EditorPage {...context} {...editorProps} />}
                />
                <Route
                  path="/" render={(context) => {
                    const list = memoryStore.list(this.state.keyword, this.state.currentDir, this.state.configs.isShowArchived === 'on');

                    return (
                      <ListPage
                        {...context}
                        item={this.state.item}
                        keyword={this.state.keyword}
                        list={list}
                        configs={this.state.configs}
                        treeMinWidth={TREE_MIN_WIDTH}
                        treeWidth={this.state.treeWidth}
                        fulllist={memoryStore.list('', '', this.state.configs.isShowArchived === 'on' )}
                        isOpenTree={this.state.isOpenTree}
                        currentDir={this.state.currentDir}
                        onClickDir={this.changeDir}
                        onResizeTree={this.resizeTree}
                        onClickStar={this.toggleStar}
                        onClickClosePath={this.backToAll}
                        onClickArchive={this.toggleArchiveMemo}
                        onClickEditPath={this.openInput}
                      />
                    );
                  }
                }
                />
                <Redirect from="*" to="/" />
              </Switch>
            </div>

            <Switch>
              <Route
                exact path="/" render={() => (true || this.state.currentDir === '') ? null : <div className="footer-bar" onClick={this.backToAll}>Path: {this.state.currentDir}<i className="fa fa-times" /></div>}
              />
            </Switch>

          </div>
        </HashRouter>

        { this.state.help ? <HelpWindow onClose={this.closeHelp} /> : null }
        { this.state.config ? <ConfigWindow onChange={this.updateConfig} configs={this.state.configs} onClose={this.closeConfig} /> : null }
        { this.state.qr ? <QRWindow onClose={this.closeQR} value={this.state.selectingText} /> : null }
        { this.state.isShowInput ? <InputWindow onClose={this.closeInput} onSubmit={this.submitInput} value={this.state.currentPath} /> : null }
      </div>
    );
  }
}
