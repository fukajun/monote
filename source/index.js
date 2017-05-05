//
// MainProcess
'use strict';

const ACTIVE_MENUBAR_ICON   = __dirname + '/images/active.png'
const INACTIVE_MENUBAR_ICON = __dirname + '/images/inactive.png'
const NOTIFY_ICON           = __dirname + '/images/notify_icon.png'
import menubar from 'menubar';
import { app, ipcMain, globalShortcut, Menu } from 'electron';
import notifier from 'node-notifier';
import path from 'path'
import fs from 'fs'

const request = require('request');
const mb = menubar({ icon: ACTIVE_MENUBAR_ICON, dir: __dirname });
console.log(__dirname)

//const mb = menubar({ icon: ACTIVE_MENUBAR_ICON  });
mb.setOption('width', 500)

const switchIconUnread = ()=> {
  mb.tray.setImage(ACTIVE_MENUBAR_ICON )
}
const switchIconRead = ()=> {
  mb.tray.setImage(ACTIVE_MENUBAR_ICON )
}
const setTrayTitle = (title)=> {
  mb.tray.setTitle(title)
}
const initMenu = ()=> {
  var template = [{
      label: "Application1",
      submenu: [
          { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
          { type: "separator" },
          { label: "Quit",       accelerator: "Command+Q", click: function() { app.quit(); }}
      ]}, {
      label: "Edit",
      submenu: [
          { label: "Undo",       accelerator: "CmdOrCtrl+Z",       selector: "undo:" },
          { label: "Redo",       accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type:  "separator" },
          { label: "Cut",        accelerator: "CmdOrCtrl+X",       selector: "cut:" },
          { label: "Copy",       accelerator: "CmdOrCtrl+C",       selector: "copy:" },
          { label: "Paste",      accelerator: "CmdOrCtrl+V",       selector: "paste:" },
          { label: "Select All", accelerator: "CmdOrCtrl+A",       selector: "selectAll:" }
      ]}
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

const KEY_GO_LIST       = 'CmdOrCtrl+['
const KEY_TOGGLE_WINDOW = 'ctrl+shift+n'

mb.on('ready', function ready () {

  var closeWindow = ()=> {
    mb.hideWindow();
  }
  var openWindow = ()=> {
    mb.showWindow(mb.tray.getBounds());
  }
  //
  // Toggle window show and hide
  //
  // NOTE: Unregister shorcut key event.
  //       Shortcut key is not left to the old webview after reload.
  globalShortcut.unregister(KEY_TOGGLE_WINDOW);
  globalShortcut.register(KEY_TOGGLE_WINDOW, ()=> {
    if(mb.window.isVisible()) {
      closeWindow();
    } else {
      openWindow();
    }
  });
  //globalShortcut.unregister(KEY_GO_LIST);
  //globalShortcut.register(KEY_GO_LIST, ()=> {
  //  console.log(mb)
  //  mb.window.send('go_list')
  //});

  //
  // Setting ipc event
  ipcMain.on('notify', (event, title, message)=> {
    notifier.notify({
      title: title,
      icon: NOTIFY_ICON,
      message: message
    })
  });
  ipcMain.on('show_window', (event, arg)=> {
    openWindow();
  });
  ipcMain.on('set_title', (event, text)=> {
    setTrayTitle(text.trim())
  });
  ipcMain.on('save', (event, arg)=> {
    console.log(arg)
    fs.writeFile('./hoge.md', arg, 'utf8', function (err) {
      if (err) {
        return console.log(err);
      }
    });
  });
  ipcMain.on('quit', (event, arg)=> {
    app.quit();
  });
  ipcMain.on('reload', (event, arg)=> {
    let browserWindow = event.sender;
    browserWindow.reload()
  });
  notifier.on('click', (event, arg)=> {
    mb.showWindow();
  });
  mb.on('show', ()=> {
    setTimeout(()=> {
      switchIconRead();
    }, 1000);
  })
  mb.on('hide', ()=> {
    switchIconRead();
  })

  mb.showWindow();
  mb.hideWindow();
  // NOTE: Comment out for display Dev tool
  initMenu();
  switchIconUnread();
})
