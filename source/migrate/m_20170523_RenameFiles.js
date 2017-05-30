import fs from 'fs'
import Store from '../models/TextLoadableJsonStore.js'
import moment from 'moment';
import _u from 'lodash'

export default class m_20170523_RenameFiles {
  run() {
    const store = new Store()
    let list = store.list()
    _u.forEach(list, (item) => {
      let newId = moment(item.created_at).utc().format("YYYYMMDDHHmmssSSS")
      store.delete(item)
      store.save(_u.merge(item, {id: newId}))
    })
  }
}
