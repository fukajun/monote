const TITLE_DELIMITER = "\n"
const NOCONTENS_TITLE = '< Untitled >'

export default class Item {
  constructor({id, path, contents, ctime}) {
    this.id = id
    this.path = path
    this.ctime = ctime
    this.contents = contents
  }

  title() {
    let path = this._trimdPath()
    if(path.length >= 1) {
      return path
    }
    let title = this._titleFromContents()
    if (title.length >= 1) {
      return title
    }
    return NOCONTENS_TITLE
  }

  body() {
    let first, last;
    [first, ...last] = this._splitedContens()
    return last.join(TITLE_DELIMITER)
  }

  line() {
    return (this.body().replace(/[\r\n]/g, ''))
  }

  _trimdPath() {
    return (this.path || '').trim()
  }

  _titleFromContents() {
    let first, last;
    [first, ...last] = this._splitedContens()
    return first.trim()
  }

  _splitedContens() {
    return this.contents.split(TITLE_DELIMITER)
  }
}
