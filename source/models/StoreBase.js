import sha1 from 'sha1';
import Item from './Item.js';
import _u from 'lodash';
import moment from 'moment';

//
// StoreBase
export default class StoreBase {
  buildNewItem(args = {}) {
    const attrs = _u.merge(this._defaultAttributes(), args);
    return new Item(attrs);
  }

  store(item) {
    const blankBodyPattern = /^[　 \n\r]*?$/;
    if (item.contents.match(blankBodyPattern)) {
      this.delete(item);
    } else {
      this.save(item);
    }
  }

  list(word = '', dir = '') {
    let list = this._list(word).map((data => this._buildItem(data)));
    list = list.sort((a, b) => (b.biggerThan(a) ? 1 : -1));
    if (dir === '') {
      return list;
    }
    return list.filter(item => item.dirpath() === dir);
  }

  load(id) {
    const data = this._read(id);
    return this._buildItem(data);
  }

  save(item) {
    const updated_at = this._now();
    this._write(item.id, item.path, item.contents, item.pin, item.modified_at, updated_at, item.created_at);
  }

  delete(item) {
    this._delete(item.id);
  }

  _buildItem(attributes) {
    const attrs = _u.merge(this._defaultAttributes(), attributes);
    return new Item(attrs);
  }

  _now() {
    return moment().utc();
  }

  _defaultAttributes() {
    const now = this._now();
    return { id: this._newId(now), path: '', contents: '', pin: false, modified_at: now, updated_at: now, created_at: now };
  }

  _newId(now = this._now()) {
    return moment(now).format('YYYYMMDDHHmmssSSS');
  }

  _list(word) { }
  _read(id) { }
  _write(id, path, contents) { }
  _delete(id) { }
}

