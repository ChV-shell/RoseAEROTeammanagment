const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

// Production modunda menüleri gizle
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: 'Rose E-Team Management System',
    backgroundColor: '#0F0F0F',
    icon: path.join(__dirname, 'icon.png'), // İkon dosyasının yolunu buraya koymalısın
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Basit iletişim için
      webSecurity: false // Yerel geliştirme için
    },
    frame: true, // Standart pencere çerçevesi
    autoHideMenuBar: true // Menü çubuğunu gizle (Tam profesyonel görünüm)
  });

  // Uygulama yüklendiğinde çalışacak URL
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, 'build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC İletişimi (Renderer'dan gelen sinyalleri dinle)
ipcMain.on('app-quit', () => {
  app.quit();
});
