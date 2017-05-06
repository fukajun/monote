//
// Renderer
'use strict';

//
// Vendor
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Tree from './Tree.js'
//
// Lib
import Store from '../models/JsonStore.js'

const store = new Store()

export default class ListPage extends React.Component {
  render() {
    let seq = 0
    let word = this.props.keyword
    return (
      <div className='list'>
        { this.props.isOpenTree ? <Tree currentDir={this.props.currentDir} list={this.props.fulllist} onClick={this.props.onClickDir}/> : [] }
        <ul className='items'>
          {
            this.props.list.map((item)=> {
              let key = seq <= 9 ? `[${seq++}]` : ''
              return (
                <li className='item' key={item.id}>
                   <Link className='item-link' to={`/edit/${item.id}`}>
                    <div className='item-link-title'>
                      {item.title()} {key}
                    </div>
                    <div className='item-link-ctime'>{moment(item.ctime).format("Y/M/D hh:mm")}</div>
                    <br />
                    <div className='item-link-info'>
                      <span className='item-link-body'>{item.dirname()}</span>
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
