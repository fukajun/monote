import Path from 'path';
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
    return Path.basename(this.fullpath())
  }

  body() {
    let first, last;
    [first, ...last] = this._splitedContens()
    return last.join(TITLE_DELIMITER)
  }

  line() {
    return (this.body().replace(/[\r\n]/g, ''))
  }

  fullpath() {
    if(this._hasPath()) {
      if(this._isDirPath()) {
        return `${this._normalizePath()}${this._safeTitleFromContents()}`
      } else {
        return this._normalizePath()
      }
    } else {
      return `/${this._safeTitleFromContents()}`
    }
  }

  dirpath() {
    return Path.dirname(this.fullpath())
  }

  _hasPath() {
    return this._trimdPath().length >= 1
  }

  _isDirPath() {
    let normalizedPath = this._normalizePath()
    return (normalizedPath[normalizedPath.length - 1] === '/')
  }

  _normalizePath() {
    let path = this._trimdPath()
    return path[0] === '/' ? path : `/${path}`
  }

  _trimdPath() {
    return (this.path || '').trim()
  }

  // For title
  _safeTitleFromContents() {
    let title = this._titleFromContents()
    if (title.length >= 1) {
      return `${title}`
    } else {
      return `${NOCONTENS_TITLE}`
    }
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
