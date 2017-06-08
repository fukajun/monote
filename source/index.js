//
// MainProcess
'use strict';

const { app, ipcMain, globalShortcut, Menu } = require('electron');
const fs = require('fs');

import menubar from 'menubar';
import path from 'path';
import _u from 'lodash';

const ACTIVE_MENUBAR_ICON       = __dirname + '/images/active.png'
const ACTIVE_INV_MENUBAR_ICON   = __dirname + '/images/active_invert.png'
const INACTIVE_MENUBAR_ICON     = __dirname + '/images/inactive.png'
const NOTIFY_ICON               = __dirname + '/images/notify_icon.png'
const KEY_GO_LIST               = 'CmdOrCtrl+['
const KEY_TOGGLE_WINDOW         = 'ctrl+shift+n'

// NOTE: Icon option is needed because raise error from package of menubar.
var menubarOptions = { icon: NOTIFY_ICON, minWidth: 500, width: 600, height: 600 };
if(process.env.NODE_ENV === 'development') {
  menubarOptions = _u.assign(menubarOptions, { showDockIcon: true })
}

const mb = menubar(menubarOptions);
const switchIconOpen = ()=> {
  mb.tray.setImage(ACTIVE_INV_MENUBAR_ICON)
}
const switchIconClose = ()=> {
  mb.tray.setImage(ACTIVE_MENUBAR_ICON)
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


mb.on('ready', function() {

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

  //
  // Setting ipc event
  ipcMain.on('show_window', (event, arg)=> {
    openWindow();
  });
  ipcMain.on('set_title', (event, text)=> {
    setTrayTitle(text.trim())
  });
  ipcMain.on('quit', (event, arg)=> {
    app.quit();
  });
  ipcMain.on('reload', (event, arg)=> {
    let browserWindow = event.sender;
    browserWindow.reload()
  });
  mb.on('show', ()=> {
    mb.window.send('windowShow')
    switchIconOpen();
  })
  mb.on('hide', ()=> {
    switchIconClose();
  })

  mb.showWindow();
  mb.hideWindow();
  if(process.env.NODE_ENV !== 'development') {
    // NOTE: Comment out for display Dev tool
    initMenu();
  }
  switchIconClose();
})
