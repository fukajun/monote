import { ipcRenderer } from 'electron';
import React from 'react';
import ReactDom from 'react-dom';
//
// Renderer

document.addEventListener("DOMContentLoaded", ()=> {
  var quitIcon = document.querySelector('.js-quit-icon')
  var reloadIcon = document.querySelector('.js-reload-icon')
  quitIcon.addEventListener('click', ()=> {
    if(!confirm('終了しますか？')) {
      return
    }
    ipcRenderer.send('quit')
  })
  reloadIcon.addEventListener('click', ()=> {
    if(!confirm('リロードしますか？')) {
      return
    }
    ipcRenderer.send('reload')
  })
  console.log('init')
  class Editor extends React.Component {
    constructor(props) {
      super(props)
      this.style = {
        container: {
          width: '100%',
          height: '90%'
        }
      }
    }
    render() {
      return (<div>
        <textarea style={this.style.container}/>
      </div>
      )
    }
  }

  ReactDom.render(
    <Editor />,
    document.querySelector('.app')
  )
})
