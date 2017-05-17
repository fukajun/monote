'use strict';

import React from 'react';

const CURSOR_POSITION = 0

export default class EditorPage extends React.Component {
  componentDidMount() {
    let defaultCursorPosition = this.props.configs.cursorPosition === 'top' ? 0 : 999999
    this._setCursorPosition(this.props.startPos || defaultCursorPosition)
  }

  change(e) {
    this.props.onChange(this.refs.inputContents.value, this.refs.inputPath.value)
  }

  moveCursor(e) {
    this.props.onMoveCursor(this.refs.inputContents.selectionStart)
  }

  _setCursorPosition(pos) {
    // NOTE: Important call order
    this.refs.inputContents.setSelectionRange(pos , pos)
    this.refs.inputContents.focus()
  }

  render() {
    return (
      <div className='editor'>
        <textarea
          className='editor-input-contents'
          ref='inputContents'
          onChange={this.change.bind(this)}
          onKeyDown={this.moveCursor.bind(this)}
          onClick={this.moveCursor.bind(this)}
          value={this.props.item.contents}
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
