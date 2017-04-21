import fs from 'fs'
import sha1 from 'sha1'

const DIR = process.env['HOME'] + '/.monotes'
const ENCODING = 'utf-8'
const TITLE_DELIMITER = "\n"

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
    let body  = this.load(id)
    let first = body.split(TITLE_DELIMITER)[0]
    let title = (first.length >= 1 ? first : '< Untitled >')
    let stat  = this.fileStat(id)
    return { id: id, title: title, ctime: stat['ctime'] }
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

