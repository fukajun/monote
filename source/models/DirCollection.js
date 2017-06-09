import _u from 'lodash';
import Path from 'path';


function pathLevel(path) {
  return path.split('/').length - 1;
}

class Dir {
  constructor(path) {
    this.path = path;
    this.items = [];
  }

  level() {
    return pathLevel(this.path);
  }

  basename() {
    return Path.basename(this.path);
  }
  slashedBasename() {
    return `/${this.basename()}`;
  }
  endSlashedBasename() {
    return `${this.basename()}/`;
  }

}

export default class DirCollection {
  constructor(list) {
    this.items = list;
    const checkDirs = {};
    this.items.forEach((item) => {
      const itemDirpath = item.dirpath();

      if (!checkDirs[itemDirpath]) {
        // NOTE: Set all path valiation from item.dirpath
        const dirpaths = this._pathsFromPath(itemDirpath);
        dirpaths.forEach((dirpath) => {
          if (!checkDirs[dirpath]) {
            checkDirs[dirpath] = new Dir(dirpath);
          }
        });
      }

      checkDirs[itemDirpath].items.push(item);
    });
    this.list = _u.map(checkDirs, (k, _) => k).sort((a, b) => (a.path < b.path ? -1 : 1));
  }

  _pathsFromPath(dirpath) {
    const list = [];
    const level = pathLevel(dirpath);
    for (let i = 0; i < level; i += 1) {
      const currentDirPattern = new RegExp(`(/[^/]+){${i}}$`);
      const result = dirpath.replace(currentDirPattern, '');
      list.push(result);
    }
    return list;
  }
}

