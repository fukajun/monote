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
    this.refs.inputBody.focus()
  }

  change(e) {
    this.props.onChange(this.refs.inputBody.value, this.refs.inputTitle.value)
  }

  render() {
    return (
      <div>
        <textarea
          className='editor-input-contents'
          ref='inputBody'
          onChange={this.change.bind(this)}
          value={this.props.item.contents}
        />
        <input ref='inputTitle'
          className='editor-input-title'
          onChange={this.change.bind(this)}
          value={this.props.item.path}
          type='text'
        />
      </div>
    )
  }
}
