'use strict';

import React from 'react';

export default class EditorPage extends React.Component {
  componentDidMount() {
    this.refs.inputContents.focus()
  }

  change(e) {
    this.props.onChange(this.refs.inputContents.value, this.refs.inputPath.value)
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
          placeholder={'title OR /path/title'}
        />
      </div>
    )
  }
}
