import _u from 'underscore'
import Path from 'path';
class Dir {
  constructor(path) {
    this.path = path
    this.items = []
  }

  level() {
    return this.path.replace(/[^\/]/g, '').length
  }

  basename() {
    return Path.basename(this.path)
  }

}
export default class DirCollection {
  constructor(list) {
    this.items = list
    let checkDirs = {}
    this.items.forEach((item)=> {
      let dir = checkDirs[item.dirpath()] || ( checkDirs[item.dirpath()] = new Dir(item.dirpath())  )
      dir.items.push(item)
    })
    this.list = _u.map(checkDirs, (k, v)=> k).sort((a,b)=> a.path > b.path)
  }
}
