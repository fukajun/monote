import fs from 'fs'
import StoreBase from './StoreBase.js'
const DIR = process.env['HOME'] + '/.monotes'
const ENCODING = 'utf-8'

//
// FileStore
export default class FileStore extends StoreBase {
  constructor(dirpath = DIR) {
    super()
    this.dirpath = dirpath
    this._init(dirpath)
  }

  _list(word) {
    let list = fs.readdirSync(this.dirpath).map(
      (filename)=> (this._read(filename))
    )
    let sortAttribute = 'ctime'
    let pattern = new RegExp(word, 'i')

    return list.filter(
      (data)=> (data.contents.match(pattern))
    ).sort(
      (a, b)=> (b[sortAttribute].getTime() - a[sortAttribute].getTime())
    );
  }

  _read(id) {
    let filepath = this._filepath(id)
    let stat = fs.statSync(filepath);
    let contents  = fs.readFileSync(filepath, {encoding: ENCODING})
    return { id: id, contents: contents, ctime: stat.ctime }
  }

  _write(id, contents) {
    let filepath = this._filepath(id)
    fs.writeFileSync(filepath, contents, ENCODING)
  }

  _delete(id) {
    let filepath = this._filepath(id)
    if(!fs.existsSync(filepath)) {
      return
    }
    fs.unlinkSync(filepath)
  }

  _init(dirpath) {
    if(!fs.existsSync(DIR)) {
      fs.mkdirSync(DIR)
    }
  }

  _filepath(id) {
    return `${this.dirpath}/${id}`
  }
}
