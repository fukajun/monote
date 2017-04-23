//
// Renderer
'use strict';
//
// Vendor
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
//
// Lib
import Store from '../models/Store.js'

const store = new Store()

export default class ListPage extends React.Component {
  render() {
    var seq = 0
    return (<div>
      <ul className='items'>
        {
          store.list().map((item)=> {
            let key = seq <= 9 ? `[${seq++}]` : ''
            return (
            <li className='item' key={item.id}>
               <Link className='item-link' to={`/edit/${item.id}`}>
                <div className='item-link-title'>
                  {item.title} {key}
                </div>
                <div className='item-link-ctime'>{moment(item.ctime).format("Y/M/D hh:mm")}</div>
                <br />
                <div className='item-link-info'>
                  <span className='item-link-body'>{item.line().substring(0, 200)}</span>
                </div>
              </Link>
            </li>)
          })
        }
      </ul>
    </div>
    )
  }
}
