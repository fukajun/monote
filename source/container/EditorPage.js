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

    this.style = {
      container: {
        width: '100%',
        height: '90%'
      }
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
          ref='inputBody'
          style={this.style.container}
          onChange={this.change.bind(this)}
          value={this.props.item.contents}
        />
        <input ref='inputTitle'
          onChange={this.change.bind(this)}
          value={this.props.item.path}
          type='text'
        />
      </div>
    )
  }
}
