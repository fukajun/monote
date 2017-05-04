//
// Renderer
'use strict';

//
// Vendor
import React from 'react';
import { Link } from 'react-router-dom';
import _u from 'underscore'
import Path from 'path';

export default class Tree extends React.Component {
  clickDir(dir) {
    this.props.onClick(dir)
  }
  render() {
    let dirs = this.props.list.map((item)=> item.dirname())
    console.log(this.props.currentDir)
    return (
      <ul className='tree'>
        <li className='tree-item' key={'-'}>
           <a className='tree-link' onClick={this.clickDir.bind(this, '')}>
            <div className='tree-link-title'>
              {'-'} {this.props.currentDir === '' ? '🌟' : ''}
            </div>
          </a>
        </li>
        {
          _u.uniq(dirs).sort().map((dir)=> {
            let displayDir = dir === '/' ? 'TOP' : dir
            return (
              <li className='tree-item' key={dir}>
                 <a className='tree-link' onClick={this.clickDir.bind(this, dir)}>
                  <div className='tree-link-title'>
                    {displayDir} {this.props.currentDir === dir ? '🌟' : ''}
                  </div>
                </a>
              </li>
            )
          })
        }
      </ul>
    )
  }
}
