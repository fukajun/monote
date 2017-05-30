import _u from 'lodash'
import Path from 'path';


function pathLevel(path) {
  return path.split('/').length - 1
}

class Dir {
  constructor(path) {
    this.path = path
    this.items = []
  }

  level() {
    return pathLevel(this.path)
  }

  basename() {
    return Path.basename(this.path)
  }
  slashedBasename() {
    return `/${this.basename()}`
  }

}

export default class DirCollection {
  constructor(list) {
    this.items = list
    let checkDirs = {}
    this.items.forEach((item)=> {
      let itemDirpath = item.dirpath()

      if(!checkDirs[itemDirpath]) {
        // NOTE: Set all path valiation from item.dirpath
        let dirpaths = this._pathsFromPath(itemDirpath)
        dirpaths.forEach((dirpath) => {
          if(!checkDirs[dirpath]) {
            checkDirs[dirpath] = new Dir(dirpath)
          }
        })
      }

      checkDirs[itemDirpath].items.push(item)
    })
    this.list = _u.map(checkDirs, (k, v)=> k).sort((a,b)=> (a.path < b.path ? -1 : 1))
  }

  _pathsFromPath(dirpath) {
    let list = []
    let level = pathLevel(dirpath)
    for(let i = 0; i < level; i++) {
      let currentDirPattern  = new RegExp(`(/[^\/]+){${i}}$`)
      let result = dirpath.replace(currentDirPattern, '')
      list.push(result)
    }
    return list
  }
}

