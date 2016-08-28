const electron = require('electron');
const app = electron.app;
try {
  require('electron-debug')();
} catch (e) {
  console.log('Package `electron-debug` not found, not enabling debug features.');  // eslint-disable-line no-console
}
require('electron-pug')({ pretty: true }, {});
let mainWindow;  // Prevents the main window to be garbage collected

function onClosed() {
  mainWindow = null;
}

function createMainWindow() {
  const win = new electron.BrowserWindow({
    width: 1000,
    height: 700
  });

  win.loadURL(`file://${__dirname}/app/index.pug`);
  win.on('closed', onClosed);

  return win;
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', () => {
  mainWindow = createMainWindow();
});
