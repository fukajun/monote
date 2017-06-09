import JsonStore from './JsonStore';

export default class TextLoadableJsonStore extends JsonStore {
  _convertOnRead(contents) {
    // For JSON
    if ((contents || '')[0] === '{') {
      return contents;
    }
    // For Plain text
    return JSON.stringify({ path: '', contents, ping: false });
  }
}
