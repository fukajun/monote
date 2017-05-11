import fs from 'fs'
import StoreBase from './StoreBase.js'
const DIR = process.env['HOME'] + '/.monotes'
const ENCODING = 'utf-8'
import _u from 'lodash'

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
    let words = word.replace(/[ 　]/g, ' ').split(' ')
    let patterns = words.map((word)=> new RegExp(word, 'i'))

    return list.filter(
      (data)=> _u.every(patterns, (pattern)=> ((data.contents||'') + (data.path || '')).match(pattern))
    )
  }

  _read(id) {
    let filepath = this._filepath(id)
    let stat = fs.statSync(filepath);
    let contents  = fs.readFileSync(filepath, {encoding: ENCODING})
    let convertedContents = this._convertOnRead(contents) // hook method
    let json = JSON.parse(convertedContents)
    return { id: id,
            path: json.path,
            contents: json.contents,
            ctime: stat.ctime,
            pin: json.pin,
            updated_at: json.updated_at ?  new Date(json.updated_at) : stat.ctime,
            created_at: json.created_at ?  new Date(json.created_at) : stat.birthtime
    }
  }

  _write(id, path, contents, pin, updated_at, created_at) {
    let filepath = this._filepath(id)
    let json_body = JSON.stringify({path: path, contents: contents, pin: pin, updated_at: updated_at, created_at: created_at})
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

  _convertOnRead(contents) {
    return contents
  }
}
