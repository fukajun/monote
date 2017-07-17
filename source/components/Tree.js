import React from 'react';
import { Link } from 'react-router-dom';
import Path from 'path';

import DirCollection from '../models/DirCollection';

const INDENT = '  ';
const NEST_MARK = '└ ';

export default class Tree extends React.Component {
  clickDir(dir) {
    this.props.onClick(dir);
  }
  clickEdit(path, e) {
    e.stopPropagation()
    this.props.onClickEdit(path);
  }
  createListItem(name, path, isCurrent, length, level) {
    let indent = '';
    if (level >= 2) {
      indent = Array(level).join(INDENT) + NEST_MARK;
    }
    return (
      <li className="tree-item" key={path}>
        <a className={`tree-link ${isCurrent ? 'active' : ''}`} onClick={this.clickDir.bind(this, path)}>
          <span className="tree-link-title">
            {indent}{name}
          </span>
          <span className="tree-link-item-size">{length}</span>
          { path.length <= 1 ? null : <span className="tree-item-edit-link " onClick={this.clickEdit.bind(this, path)}><i className='fa fa-pencil' /></span> }
        </a>
      </li>
    );
  }
  render() {
    const collection = new DirCollection(this.props.list);
    return (
      <ul className="tree">
        { this.createListItem('ALL', '', (this.props.currentDir === ''), this.props.list.length, 0) }
        { collection.list.map(dir => (
              this.createListItem(dir.slashedBasename(), dir.path, (this.props.currentDir === dir.path), dir.items.length, dir.level())
            ))
        }
      </ul>
    );
  }
}
