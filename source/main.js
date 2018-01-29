//
// MainProcess
// 'use strict';
import menubar from 'menubar';
import path from 'path';
import _u from 'lodash';

const { app, ipcMain, globalShortcut, Menu } = require('electron'); // eslint-disable-line

const ACTIVE_MENUBAR_ICON = path.join(__dirname, '/images/active.png');
const ACTIVE_INV_MENUBAR_ICON = path.join(__dirname, '/images/active_invert.png');
const NOTIFY_ICON = path.join(__dirname, '/images/notify_icon.png');
const KEY_TOGGLE_WINDOW = 'ctrl+shift+n';

// NOTE: Icon option is needed because raise error from package of menubar.
let menubarOptions = { icon: NOTIFY_ICON, minWidth: 500, width: 600, height: 600 };
if (process.env.NODE_ENV === 'development') {
  menubarOptions = _u.assign(menubarOptions, { showDockIcon: true });
}

const mb = menubar(menubarOptions);
const switchIconOpen = () => {
  mb.tray.setImage(ACTIVE_INV_MENUBAR_ICON);
};
const switchIconClose = () => {
  mb.tray.setImage(ACTIVE_MENUBAR_ICON);
};
const setTrayTitle = (title) => {
  mb.tray.setTitle(title);
};
const initMenu = () => {
  /* eslint-disable */
  const template = [{
    label: 'Application1',
    submenu: [
      { label: 'About Application', selector: 'orderFrontStandardAboutPanel:' },
      { type: 'separator' },
      { label: 'Quit',       accelerator: 'Command+Q', click: () => { app.quit(); } }
    ] }, {
    label: 'Edit',
    submenu: [
      { label: 'Undo',       accelerator: 'CmdOrCtrl+Z',       selector: 'undo:' },
      { label: 'Redo',       accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { type:  'separator' },
      { label: 'Cut',        accelerator: 'CmdOrCtrl+X',       selector: 'cut:' },
      { label: 'Copy',       accelerator: 'CmdOrCtrl+C',       selector: 'copy:' },
      { label: 'Paste',      accelerator: 'CmdOrCtrl+V',       selector: 'paste:' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A',       selector: 'selectAll:' }
    ] }
  ];
  /* eslint-enable */
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};


mb.on('ready', () => {
  const closeWindow = () => {
    mb.hideWindow();
  };
  const openWindow = () => {
    mb.showWindow(mb.tray.getBounds());
  };
  //
  // Toggle window show and hide
  //
  // NOTE: Unregister shorcut key event.
  //       Shortcut key is not left to the old webview after reload.
  globalShortcut.unregister(KEY_TOGGLE_WINDOW);
  globalShortcut.register(KEY_TOGGLE_WINDOW, () => {
    if (mb.window.isVisible()) {
      closeWindow();
    } else {
      openWindow();
    }
  });

  //
  // Setting ipc event
  ipcMain.on('show_window', () => {
    openWindow();
  });
  ipcMain.on('set_title', (_, text) => {
    setTrayTitle(text.trim());
  });
  ipcMain.on('quit', () => {
    app.quit();
  });
  ipcMain.on('reload', (event) => {
    const browserWindow = event.sender;
    browserWindow.reload();
  });
  mb.on('show', () => {
    mb.window.send('windowShow');
    switchIconOpen();
  });
  mb.on('hide', () => {
    switchIconClose();
  });
  mb.showWindow();
  mb.hideWindow();

  if (process.env.NODE_ENV !== 'development') {
    // NOTE: Comment out for display Dev tool
    initMenu();
  }
  switchIconClose();
});
