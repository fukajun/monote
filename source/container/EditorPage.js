'use strict';

import React from 'react';
import { shell } from 'electron';
import _u from 'lodash'
import RichTextarea from './RichTextarea.js'

const CURSOR_POSITION = 0
const URL_PATTERN = /(https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.?[a-z]{2,6}\b[-a-zA-Z0-9@:%_\+.~#?&//=]*)/

export default class EditorPage extends React.Component {
  constructor(props) {
    super(props)
    let defaultCursorPosition = (this.props.configs.cursorPosition === 'top' ? 0 : 999999)
    this.startPosition = this.props.startPosition || defaultCursorPosition
  }
  _changeContents(contents) {
    this.props.onChange(contents, this.refs.inputPath.value)
  }
  render() {
    return (
      <div className='editor'>
        <div className='contents-editor'>
          <RichTextarea
            value={this.props.item.contents}
            startPosition={this.startPosition}
            isEnableLink={this.props.isEnableLink}
            onMoveCursor={this.props.onMoveCursor}
            onChange={this._changeContents.bind(this)}
          />
        </div>
        <div className='path-editor'>
          <input ref='inputPath'
            className='editor-input-path'
            onChange={this._changeContents.bind(this)}
            value={this.props.item.path}
            type='text'
            placeholder={'title OR /directory/path/ OR /directory/path/title'}
          />
        </div>
      </div>
    )
  }
}
