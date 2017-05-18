'use strict';

import React from 'react';
import { shell } from 'electron';
import _u from 'lodash'

const CURSOR_POSITION = 0
const URL_PATTERN = /(https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.?[a-z]{2,6}\b[-a-zA-Z0-9@:%_\+.~#?&//=]*)/

export default class EditorPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isScrolling: false
    }

    this.debounceOnScroll = _u.debounce(()=> {
      this.setState({isScrolling: false})
    }, 100)
  }

  componentDidMount() {
    let defaultCursorPosition = this.props.configs.cursorPosition === 'top' ? 0 : 999999
    this._setCursorPosition(this.props.startPos || defaultCursorPosition)
  }

  _changeContents(e) {
    this.props.onChange(this.refs.inputContents.value, this.refs.inputPath.value)
  }

  _handleScroll(e) {
    const scrollTop = e.target.scrollTop;
    this.refs.coverContents.scrollTop = scrollTop;

    // Disable url link in scrolling
    this.setState({isScrolling: true})
    this.debounceOnScroll()
  }

  _handleLinkClick(e) {
    e.preventDefault()
    shell.openExternal(e.target.href);
  }

  _moveCursor(e) {
    this.props.onMoveCursor(this.refs.inputContents.selectionStart)
  }

  _setCursorPosition(pos) {
    // NOTE: Important call order
    this.refs.inputContents.setSelectionRange(pos , pos)
    this.refs.inputContents.focus()
  }

  _isEnableUrl() {
    return !this.state.isScrolling && this.props.isShowCover
  }

  renderCoverContents() {
    const keyName = 'coverElement'
    const urlStateClassName = this._isEnableUrl() ? 'active' : 'disable'
    let i = 0
    return (
      this.props.item.contents.split("\n").map((str)=> {
        const lineElements = str.split(URL_PATTERN).map((el)=> {
          if(el.match(URL_PATTERN)) {
            return <a key={`${keyName}-${i++}`} href={el}  className={`editor-cover-contents-url ${urlStateClassName}`} onClick={this._handleLinkClick.bind(this)}>{el}</a>
          }
          return <span key={`${keyName}-${i++}`}  >{el}</span>
        })
        return (<span key={`${keyName}-${i++}`} >{lineElements}<br /></span>)
      })
    )
  }

  render() {
    let inputStateClassName = this.state.isScrolling ? 'disable' : 'active'
    let coverStateClassName = this.state.isScrolling ? 'active' : 'disable'

    return (
      <div className='editor'>

        <div className='editor-bg'>
          <div className='editor-cover'>
            <div ref='coverContents' className={`editor-cover-contents ${coverStateClassName}`} >
              {this.renderCoverContents()}
            </div>
            <div className='editor-cover-path'></div>
          </div>
        </div>

        <textarea
          className={`editor-input-contents ${inputStateClassName}`}
          ref='inputContents'
          onChange={this._changeContents.bind(this)}
          onKeyDown={this._moveCursor.bind(this)}
          onClick={this._moveCursor.bind(this)}
          value={this.props.item.contents}
          onScroll={this._handleScroll.bind(this)}
        />

        <input ref='inputPath'
          className='editor-input-path'
          onChange={this._changeContents.bind(this)}
          value={this.props.item.path}
          type='text'
          placeholder={'title OR /directory/path/ OR /directory/path/title'}
        />
      </div>
    )
  }
}
