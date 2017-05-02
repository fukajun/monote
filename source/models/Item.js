const TITLE_DELIMITER = "\n"

export default class Item {
  constructor({id, contents, ctime}) {
    this.id = id
    this.ctime = ctime
    this.contents = contents
  }

  title() {
    let first, last;
    [first, ...last] = this._splitedContens()
    return (first.length >= 1 ? first : '< Untitled >')
  }

  body() {
    let first, last;
    [first, ...last] = this._splitedContens()
    return last.join(TITLE_DELIMITER)
  }

  line() {
    return (this.body().replace(/[\r\n]/g, ''))
  }

  _splitedContens() {
    return this.contents.split(TITLE_DELIMITER)
  }
}
