//
// Renderer
'use strict';
//
// Vendor
import React from 'react';
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
            return (<li className='item' key={item.id}>
               <Link to={`/edit/${item.id}`}>{item.title} {key}</Link>
            </li>)
          })
        }
      </ul>
    </div>
    )
  }
}
