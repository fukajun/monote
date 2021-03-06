import React from 'react';
import { shell } from 'electron';
import _u from 'lodash';

import RichTextarea from '../components/RichTextarea.js';

export default class EditorPage extends React.Component {
  constructor(props) {
    super(props);
    const defaultCursorPosition = (this.props.configs.cursorPosition === 'top' ? 0 : 999999);
    this.startPosition = this.props.startPosition || defaultCursorPosition;
  }

  componentDidMount(){
     this.refs.inputContents.focus();
  }

  _changeContents(contents) {
    this.props.onChange(this.refs.inputContents.value, this.refs.inputPath.value);
  }

  render() {
    return (
      <div className="editor">
        <div className="contents-editor">
          <RichTextarea
            ref="inputContents"
            value={this.props.item.contents}
            startPosition={this.startPosition}
            isEnableLink={this.props.isEnableLink}
            onClickLink={this.props.onClickLink}
            onClickIdLink={this.props.onClickIdLink}
            onClickNewLink={this.props.onClickNewLink}
            onMoveCursor={this.props.onMoveCursor}
            onSelect={this.props.onSelectContents}
            onChange={this._changeContents.bind(this)}
          />
        </div>
        <div className="path-editor">
          <input
            ref="inputPath"
            className="editor-input-path"
            onChange={this._changeContents.bind(this)}
            value={this.props.item.path}
            type="text"
            placeholder={'title OR /directory/path/ OR /directory/path/title'}
          />
        </div>
      </div>
    );
  }
}
