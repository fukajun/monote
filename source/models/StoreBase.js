import sha1 from 'sha1'
import Item from './Item.js'
import _u from 'lodash'

//
// StoreBase
export default class StoreBase {
  buildNewItem(args = {}) {
    let attrs = _u.merge(this._defaultAttributes(), args)
    return new Item(attrs)
  }

  store(item) {
    let blankBodyPattern = /^[　 \n\r]*?$/
    if(item.contents.match(blankBodyPattern)) {
      this.delete(item)
    } else {
      this.save(item)
    }
  }

  list(word = "", dir = '') {
    let list = this._list(word).map( ((data)=> this._buildItem(data)) )
    list = list.sort((a, b)=> (b.biggerThan(a) ? 1 : -1))
    if (dir === '') {
      return list
    }
    return list.filter((item)=> item.dirpath() === dir)
  }

  load(id) {
    let data = this._read(id)
    return this._buildItem(data)
  }

  save(item) {
    let updated_at = new Date()
    this._write(item.id, item.path, item.contents, item.pin, item.modified_at, updated_at, item.created_at)
  }

  delete(item) {
    this._delete(item.id)
  }

  _buildItem(attributes) {
    let attrs = _u.merge(this._defaultAttributes(), attributes)
    return new Item(attrs)
  }

  _defaultAttributes() {
    let now = new Date()
    return {id: sha1(Date.now()), path: '', contents: '', pin: false, modified_at: now, updated_at: now, created_at: now }
  }

  _list(word) { }
  _read(id) { }
  _write(id, path, contents) { }
  _delete(id) { }
}

