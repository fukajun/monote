'use strict';

import React from 'react';

const CURSOR_POSITION = 0
export default class EditorPage extends React.Component {
  componentDidMount() {
    this._setCursorPosition(CURSOR_POSITION)
  }

  change(e) {
    this.props.onChange(this.refs.inputContents.value, this.refs.inputPath.value)
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
