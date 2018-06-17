import _u from 'lodash';
import moment from 'moment';
import Item from './Item';

//
// StoreBase
export default class MemoryStore {
  constructor(store) {
    this._store = store
    this._items = this._store.list('', '', true, {})
  }

  buildNewItem(args = {}) {
    const attrs = _u.merge(this._defaultAttributes(), args);
    return new Item(attrs);
  }

  store(item) {
    const blankBodyPattern = /^[\u02A0\u3000 \n\r]*?$/;
    if (item.contents.match(blankBodyPattern)) {
      this.delete(item);
    } else {
      this.save(item);
    }
  }

  list(word = '', dir = '', isShowArchive = false, options = {}) {
    let items = this._filteredItems(word, isShowArchive);
    items = items.sort((a, b) => (b.biggerThan(a) ? 1 : -1));

    if (dir === '') {
      return items;
    }
    const pattern = this._generatePathPattern(dir, options.isRecursive)
    return items.filter(item => item.dirpath().match(pattern));
  }

  changeDirPath(oldPath, newPath) {
    const updatedItems = this.list('', oldPath, true, { isRecursive: true }).map((item) => {
      item.changeDirPath(newPath, oldPath)
      return item
    });
    // FIXME: Change to bulk save
    _u.forEach(updatedItems, (item) => {
      this.save(item)
    });
  }

  load(id) {
    return _u.find(this._items, { id })
  }

  save(item) {
    const i = _u.indexOf(this._items, item)
    if (i >= 0) {
      this._items[i] = item
    } else {
      this._items.push(item)
    }
    this._store.save(item)
  }

  delete(item) {
    this._items =  _u.reject(this._items, (_item)=> _item.id === item.id )
    this._store.delete(item)
  }

  _filteredItems(keyword, isArchived = false) {
    const words = keyword.replace(/[ \u3000]/g, ' ').split(' ');
    const patterns = words.map(word => new RegExp(word, 'i'));
    return this._items.filter(
      (data) => {
        if (!isArchived && data.archived_at) {
          return false;
        }
        return _u.every(patterns, pattern => ((data.contents || '') + (data.path || '')).match(pattern))
      }
    );
  }

  _generatePathPattern(path, isRecursive = false) {
    const pattern = isRecursive ? `^${path}.*$` : `^${path}$`;
    return new RegExp(pattern);
  }

  _defaultAttributes() {
    const now = this._now();
    return { id: this._newId(now), path: '', contents: '', pin: false, modified_at: now, archived_at: null, updated_at: now, created_at: now };
  }

  _now() {
    return moment().utc();
  }

  _newId(now = this._now()) {
    return moment(now).format('YYYYMMDDHHmmssSSS');
  }
}

