import fs from 'fs';
import moment from 'moment';
import _u from 'lodash';
import Store from '../models/TextLoadableJsonStore';

export default class m_20170523_RenameFiles {
  run() {
    const store = new Store();
    const list = store.list();
    _u.forEach(list, (item) => {
      const newId = moment(item.created_at).utc().format('YYYYMMDDHHmmssSSS');
      store.delete(item);
      store.save(_u.merge(item, { id: newId }));
    });
  }
}
