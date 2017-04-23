import fs from 'fs'
import sha1 from 'sha1'

const DIR = process.env['HOME'] + '/.monotes'
const ENCODING = 'utf-8'
const TITLE_DELIMITER = "\n"

class Item {
  constructor({id, contents, ctime}) {
    let title, body, first, last;
    [first, ...last] = contents.split(TITLE_DELIMITER)
    title = (first.length >= 1 ? first : '< Untitled >')
    body = last.join(TITLE_DELIMITER)

    this.id = id
    this.title = title
    this.ctime = ctime
    this.body = body
  }

  line() {
    return (this.body.replace(/[\r\n]/g, ''))
  }
}

export default class Store {
  constructor() {
    if(!fs.existsSync(DIR)) {
      fs.mkdirSync(DIR)
    }
  }

  generateId() {
    return sha1(this.seed())
  }

  load(id) {
    return fs.readFileSync(this.filePath(id), {encoding: ENCODING})
  }

  store(id, body) {
    let blankBodyPattern = /^[　 \n\r]*?$/
    if(body.match(blankBodyPattern)) {
      this.delete(id)
    } else {
      fs.writeFileSync(this.filePath(id), body, ENCODING)
    }
  }

  delete(id) {
    fs.unlinkSync(this.filePath(id))
  }

  list() {
    let sortAttribute = 'ctime'

    let list = fs.readdirSync(DIR).map((filename)=> {
      return this.fileInfo(filename)
    })

    let sortedList = list.sort((a, b)=>{
      return ( b[sortAttribute].getTime() - a[sortAttribute].getTime() )
    })
    return sortedList
  }

  fileInfo(id) {
    let contents  = this.load(id)
    let stat  = this.fileStat(id)
    let item = new Item({ id: id, contents: contents, ctime: stat['ctime'] })
    return item
  }

  fileStat(id) {
    let stat = fs.statSync(this.filePath(id));
    return stat
  }

  filePath(id) {
    return `${DIR}/${id}`
  }

  seed() {
    return Date.now()
  }
}

