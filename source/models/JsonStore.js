import fs from 'fs';
import _u from 'lodash';
import StoreBase from './StoreBase';

const DIR = `${process.env.HOME}/.monotes`;
const ENCODING = 'utf-8';

//
// JsonStore
export default class JsonStore extends StoreBase {
  constructor(dirpath = DIR) {
    super();
    this.dirpath = dirpath;
    this._init(dirpath);
  }

  _list(keyword) {
    const list = fs.readdirSync(this.dirpath).map(filename => (this._read(filename)));
    const words = keyword.replace(/[ \u3000]/g, ' ').split(' ');
    const patterns = words.map(word => new RegExp(word, 'i'));

    return list.filter(
      data => _u.every(patterns, pattern => ((data.contents || '') + (data.path || '')).match(pattern))
    );
  }

  _read(id) {
    const filepath = this._filepath(id);
    const stat = fs.statSync(filepath);
    const contents = fs.readFileSync(filepath, { encoding: ENCODING });
    const convertedContents = this._convertOnRead(contents); // hook method
    const json = JSON.parse(convertedContents);
    return { id,
      path: json.path,
      contents: json.contents,
      ctime: stat.ctime,
      pin: json.pin,
      modified_at: json.modified_at ? new Date(json.modified_at) : stat.ctime,
      updated_at: json.updated_at ? new Date(json.updated_at) : stat.ctime,
      created_at: json.created_at ? new Date(json.created_at) : stat.birthtime,
    };
  }

  _write(id, path, contents, pin, modified_at, updated_at, created_at) {
    const filepath = this._filepath(id);
    const json_body = JSON.stringify({ path, contents, pin, modified_at, updated_at, created_at });
    fs.writeFileSync(filepath, json_body, ENCODING);
  }

  _delete(id) {
    const filepath = this._filepath(id);
    if (!fs.existsSync(filepath)) {
      return;
    }
    fs.unlinkSync(filepath);
  }

  _init(dirpath) {
    if (!fs.existsSync(DIR)) {
      fs.mkdirSync(DIR);
    }
  }

  _filepath(id) {
    return `${this.dirpath}/${id}`;
  }

  _convertOnRead(contents) {
    return contents;
  }
}
