'use strict';

import React from 'react';
import { shell } from 'electron';
import _u from 'lodash'

const CURSOR_POSITION = 0
const URL_PATTERN = /(https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.?[a-z]{2,6}\b[-a-zA-Z0-9@:%_\+.~#?&//=]*)/

export default class EditorPage extends React.Component {
  componentDidMount() {
    let defaultCursorPosition = this.props.configs.cursorPosition === 'top' ? 0 : 999999
    this._setCursorPosition(this.props.startPos || defaultCursorPosition)
  }

  change(e) {
    this.props.onChange(this.refs.inputContents.value, this.refs.inputPath.value)
  }

  _handleScroll(e) {
    const scrollTop = e.target.scrollTop;
    this.refs.coverContents.scrollTop = scrollTop;
  }

  _handleLinkClick(e) {
    e.preventDefault()
    shell.openExternal(e.target.href);
  }

  moveCursor(e) {
    this.props.onMoveCursor(this.refs.inputContents.selectionStart)
  }

  _setCursorPosition(pos) {
    // NOTE: Important call order
    this.refs.inputContents.setSelectionRange(pos , pos)
    this.refs.inputContents.focus()
  }

  renderCoverContents() {
    let i = 0;
    let keyName = 'coverElement'
    let urlClassName = `editor-cover-contents-url ${this.props.isShowCover ? 'active' : 'disable'}`
    return (
      this.props.item.contents.split("\n").map((str)=> {
        let lineElements = str.split(URL_PATTERN).map((el)=> {
          if(el.match(URL_PATTERN)) {
            return <a key={`${keyName}-${i++}`} href={el}  className={urlClassName} onClick={this._handleLinkClick.bind(this)}>{el}</a>
          }
          return <span key={`${keyName}-${i++}`}  >{el}</span>
        })
        return (<span key={`${keyName}-${i++}`} >{lineElements}<br /></span>)
      })
    )
  }

  render() {
    return (
      <div className='editor'>

        <div className='editor-bg'>
          <div className='editor-cover'>
            <div ref='coverContents' className='editor-cover-contents' >
              {this.renderCoverContents()}
            </div>
            <div className='editor-cover-path'></div>
          </div>
        </div>

        <textarea
          className='editor-input-contents'
          ref='inputContents'
          onChange={this.change.bind(this)}
          onKeyDown={this.moveCursor.bind(this)}
          onClick={this.moveCursor.bind(this)}
          value={this.props.item.contents}
          onScroll={this._handleScroll.bind(this)}
        />

        <input ref='inputPath'
          className='editor-input-path'
          onChange={this.change.bind(this)}
          value={this.props.item.path}
          type='text'
          placeholder={'title OR /directory/path/ OR /directory/path/title'}
        />
      </div>
    )
  }
}
