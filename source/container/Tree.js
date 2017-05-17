//
// Renderer
'use strict';

//
// Vendor
import React from 'react';
import { Link } from 'react-router-dom';
import _u from 'lodash'
import Path from 'path';
import DirCollection from '../models/DirCollection.js';

export default class Tree extends React.Component {
  clickDir(dir) {
    this.props.onClick(dir)
  }
  createListItem(name, path, isCurrent, length, level) {
    let indent = Array(level).join(' ')
    return (
      <li className='tree-item' key={path}>
         <a className={`tree-link ${isCurrent ? 'active' : ''}`} onClick={this.clickDir.bind(this, path)}>
          <div className='tree-link-title'>
            {indent} {name}  ({ length })
          </div>
        </a>
      </li>
    )
  }
  render() {
    let collection = new DirCollection(this.props.list)
    return (
      <ul className='tree'>
        { this.createListItem('ALL', '', (this.props.currentDir === ''), this.props.list.length, 0) }
        { collection.list.map((dir)=> {
            return (
              this.createListItem(dir.path, dir.path, (this.props.currentDir === dir.path), dir.items.length, 0)
            )
          })
        }
      </ul>
    )
  }
}
