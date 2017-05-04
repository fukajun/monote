import fs from 'fs'
import StoreBase from './StoreBase.js'
const DIR = process.env['HOME'] + '/.monotes.dev'
const ENCODING = 'utf-8'

//
// JsonStore
export default class JsonStore extends StoreBase {
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
    let json = JSON.parse(contents)
    return { id: id, path: json.path, contents: json.contents, ctime: stat.ctime }
  }

  _write(id, path, contents) {
    let filepath = this._filepath(id)
    let json_body = JSON.stringify({path: path, contents: contents})
    fs.writeFileSync(filepath, json_body, ENCODING)
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
