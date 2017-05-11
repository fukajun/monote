//
// Renderer
'use strict';

//
// Vendor
import React from 'react';
import Resizable from 'react-resizable-box'
import moment from 'moment';
import { Link } from 'react-router-dom';
import Tree from './Tree.js'
//
// Lib
import Store from '../models/JsonStore.js'

const store = new Store()

export default class ListPage extends React.Component {
  resizeTree(e) {
    this.props.onResizeTree(e.clientX)
  }
  render() {
    let seq = 0
    let word = this.props.keyword
    let now = new Date() // momentjs tuning
    return (
      <div className='list'>
        { this.props.isOpenTree ? (
          <Resizable onResize={this.resizeTree.bind(this)} minWidth={this.props.treeMinWidth} width={this.props.treeWidth}>
            <Tree currentDir={this.props.currentDir} list={this.props.fulllist} onClick={this.props.onClickDir}/>
          </Resizable>
          ) : [] }

        <ul className='items'>
          {
            this.props.list.map((item)=> {
              let key = seq <= 9 ? `[${seq++}]` : ''
              return (
                <li className='item' key={item.id}>
                   <div onClick={this.props.onClickStar.bind(this, item.id)} className={`item-pin ${item.pin ? 'on' : 'off'}`}><i className='fa fa-thumb-tack'/></div>
                   <Link className='item-link' to={`/edit/${item.id}`}>
                    <div className='item-link-title'>
                      {item.title()} {key}
                    </div>
                    <div className='item-link-ctime'>{moment(item.modified_at).from(now, true)}</div>
                    <br />
                    <div className='item-link-info'>
                      <span className='item-link-body'>{item.dirpath() === '/' ? '' : item.dirpath()}</span>
                    </div>
                  </Link>
                </li>
              )
            })
          }
      </ul>
    </div>
    )
  }
}
