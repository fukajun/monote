//
// Renderer
'use strict';

// Vendor
import { ipcRenderer } from 'electron';
import React from 'react';
import _u from 'underscore'
import { Link } from 'react-router-dom';
//
// Lib
import Store from '../models/JsonStore.js'

const store = new Store()

export default class EditorPage extends React.Component {
  constructor(props) {
    super(props)

    let item, id
    if(this.props.match.params.id) {
      id = this.props.match.params.id
      item = store.load(id)
    } else {
      item = store.buildNewItem()
    }
  }

  componentDidMount() {
    this.refs.inputContents.focus()
  }

  change(e) {
    this.props.onChange(this.refs.inputContents.value, this.refs.inputPath.value)
  }

  render() {
    return (
      <div>
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
        />
      </div>
    )
  }
}
