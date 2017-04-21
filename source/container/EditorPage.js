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
import Store from '../models/Store.js'

const store = new Store()

export default class EditorPage extends React.Component {
  constructor(props) {
    super(props)

    let id, body
    if(this.props.match.params.id) {
      id = this.props.match.params.id
      body = store.load(id)
    } else {
      id = store.generateId()
      body = ''
    }

    this.state = { id, body }

    this.style = {
      container: {
        width: '100%',
        height: '90%'
      }
    }

    this.debounceSave = _u.debounce((body)=> {
      store.store(id, body)
    }, 300)
  }

  componentDidMount() {
    this.refs.inputBody.focus()
  }

  change(e) {
    this.setState({body: e.target.value})
    this.debounceSave(e.target.value)
  }

  render() {
    return (
      <div>
        <textarea
          ref='inputBody'
          style={this.style.container}
          onChange={this.change.bind(this)}
          value={this.state.body}
      />
      </div>
    )
  }
}
