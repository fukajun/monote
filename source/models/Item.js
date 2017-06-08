import Path from 'path';
const TITLE_DELIMITER = '\n';
const NOCONTENS_TITLE = '< Untitled >';

export default class Item {
  constructor(attrs) {
    this.id = attrs.id;
    this.path = attrs.path;
    this.ctime = attrs.ctime;
    this.contents = attrs.contents;
    this.pin = attrs.pin;
    this.modified_at = attrs.modified_at;
    this.updated_at = attrs.updated_at;
    this.created_at = attrs.created_at;
  }

  title() {
    return Path.basename(this.fullpath());
  }

  isNew() {
    return this.contents.length >= 1;
  }

  body() {
    let first,
      last;
    [first, ...last] = this._splitedContens();
    return last.join(TITLE_DELIMITER);
  }

  line() {
    return (this.body().replace(/[\r\n]/g, ''));
  }

  biggerThan(item) {
    if (this.pin === item.pin) {
      return this.modified_at > item.modified_at;
    }
    return this.pin === true;
  }

  fullpath() {
    if (this._hasPath()) {
      if (this._isDirPath()) {
        return `${this._normalizePath()}${this._safeTitleFromContents()}`;
      }
      return this._normalizePath();
    }
    return this._squeezeSlash(`/${this._safeTitleFromContents()}`);
  }

  dirpath() {
    return Path.dirname(this.fullpath());
  }

  _hasPath() {
    return this._trimdPath().length >= 1;
  }

  _isDirPath() {
    const normalizedPath = this._normalizePath();
    return (normalizedPath[normalizedPath.length - 1] === '/');
  }

  _normalizePath() {
    const path = this._trimdPath();
    return path[0] === '/' ? path : `/${path}`;
  }

  _trimdPath() {
    return (this.path || '').trim();
  }

  // For title
  _safeTitleFromContents() {
    const title = this._titleFromContents();
    if (title.length >= 1) {
      return `${title}`;
    }
    return `${NOCONTENS_TITLE}`;
  }

  _titleFromContents() {
    let first,
      last;
    [first, ...last] = this._splitedContens();
    return first.trim();
  }

  _splitedContens() {
    return this.contents.split(TITLE_DELIMITER);
  }

  _squeezeSlash(str) {
    return str.replace(/\/+/, '/');
  }
}
