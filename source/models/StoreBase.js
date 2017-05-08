import sha1 from 'sha1'
import Item from './Item.js'

//
// StoreBase
export default class StoreBase {
  buildNewItem() {
    return new Item({id: sha1(Date.now()), path: '', contents: '' })
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
    this._write(item.id, item.path, item.contents)
  }

  delete(item) {
    this._delete(item.id)
  }

  _buildItem(attributes) {
    return new Item({ id: attributes.id, path: attributes.path, contents: attributes.contents, ctime: attributes.ctime })
  }

  _list(word) { }
  _read(id) { }
  _write(id, path, contents) { }
  _delete(id) { }
}
