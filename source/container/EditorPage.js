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
import Store from '../models/FileStore.js'

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

    this.state = { item }

    this.style = {
      container: {
        width: '100%',
        height: '90%'
      }
    }

    this.debounceSave = _u.debounce((item)=> {
      store.store(item)
    }, 300)
  }

  componentDidMount() {
    this.refs.inputBody.focus()
  }

  change(e) {
    let newItem = _u.clone(this.state.item)
    newItem.contents = e.target.value
    this.setState({item: newItem})
    this.debounceSave(newItem)
  }

  render() {
    return (
      <div>
        <textarea
          ref='inputBody'
          style={this.style.container}
          onChange={this.change.bind(this)}
          value={this.state.item.contents}
      />
      </div>
    )
  }
}
