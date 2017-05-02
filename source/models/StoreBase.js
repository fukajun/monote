import sha1 from 'sha1'
import Item from './Item.js'

//
// StoreBase
export default class StoreBase {
  buildNewItem() {
    return new Item({id: sha1(Date.now()), contents: '' })
  }

  store(item) {
    let blankBodyPattern = /^[　 \n\r]*?$/
    if(item.contents.match(blankBodyPattern)) {
      this.delete(item)
    } else {
      this.save(item)
    }
  }

  list(word = "") {
    return this._list(word).map( ((data)=> this._buildItem(data)) )
  }

  load(id) {
    let data = this._read(id)
    return this._buildItem(data)
  }

  save(item) {
    this._write(item.id, item.contents)
  }

  delete(item) {
    this._delete(item.id)
  }

  _buildItem(attributes) {
    return new Item({ id: attributes.id, contents: attributes.contents, ctime: attributes.ctime })
  }

  _list(word) { }
  _read(id) { }
  _write(id, contents) { }
  _delete(id) { }
}

