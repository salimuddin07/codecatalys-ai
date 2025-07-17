const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const isDev = process.env.ELECTRON_IS_DEV === 'true';

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    show: false,
    backgroundColor: '#1a1a1a',
    frame: true,
    transparent: false
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile('index.html');
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Check for updates after window is shown
    if (!isDev) {
      autoUpdater.checkForUpdatesAndNotify();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Prevent navigation to external URLs
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== mainWindow.webContents.getURL().split('/').slice(0, 3).join('/')) {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });

  // Custom menu
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'About CodeCatalyst AI',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About CodeCatalyst AI',
              message: 'CodeCatalyst AI',
              detail: 'Premium AI Automation Solutions\\nVersion 1.0.0\\n\\nSpecializing in intelligent workflows, chatbot integrations, and automated solutions.'
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.reload();
          }
        },
        {
          label: 'Force Reload',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => {
            mainWindow.webContents.reloadIgnoringCache();
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Visit Website',
          click: () => {
            shell.openExternal('https://codecatalyst-ai.com');
          }
        },
        {
          label: 'Contact Support',
          click: () => {
            shell.openExternal('mailto:salimuddinsaiyed5@gmail.com');
          }
        },
        { type: 'separator' },
        {
          label: 'Check for Updates',
          click: () => {
            if (!isDev) {
              autoUpdater.checkForUpdatesAndNotify();
            } else {
              dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Updates',
                message: 'Update checking is disabled in development mode.'
              });
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available.');
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Available',
    message: 'A new version is available. It will be downloaded in the background.',
    detail: `Version ${info.version} is now available.`
  });
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available.');
});

autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded');
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Ready',
    message: 'Update downloaded. The application will restart to apply the update.',
    buttons: ['Restart Now', 'Later']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

// IPC handlers
ipcMain.handle('app-version', () => {
  return app.getVersion();
});

ipcMain.handle('app-name', () => {
  return app.getName();
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, navigationUrl) => {
    navigationEvent.preventDefault();
    shell.openExternal(navigationUrl);
  });
});
