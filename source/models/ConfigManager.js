import fs from 'fs'
const DIR = process.env['HOME']
const CONFIG_FILENAME = '.monote_conf'
const ENCODING = 'utf-8'
import _u from 'lodash'

export default class ConfigManager {
  constructor(dirpath = DIR) {
    this.dirpath = dirpath
    this._init()
  }

  load() {
    let contents  = fs.readFileSync(this._filepath(), {encoding: ENCODING})
    let configs = JSON.parse(contents)
    return configs
  }

  save(configs) {
    let json_body = JSON.stringify(configs)
    fs.writeFileSync(this._filepath(), json_body, ENCODING)
  }


  _init(dirpath) {
    if(!fs.existsSync(this._filepath())) {
      this.save(this._defaultValues())
    }
  }

  _defaultValues() {
    return {pinColor: 'red', cursorPosition: 'top'}
  }

  _filepath() {
    return `${this.dirpath}/${CONFIG_FILENAME}`
  }
}
