const { app, BrowserWindow, globalShortcut, clipboard, ipcMain, dialog, Notification } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Create a store to save API key with custom name
const store = new Store({
  name: 'writeRight-config'
});

let mainWindow;
let firstRun = true;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 580,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    resizable: false,
    title: 'WriteRight'
  });

  mainWindow.loadFile('index.html');
  
  // Hide default menu
  mainWindow.setMenu(null);
  
  // Check if API key already exists
  const apiKey = store.get('geminiApiKey');
  
  // If the app has been set up and this isn't the first run, hide the window
  if (apiKey && !firstRun) {
    mainWindow.hide();
  } else {
    firstRun = false;
  }
  
  // When the window is closed, hide it instead of quitting the app
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
    return true;
  });
}

app.whenReady().then(() => {
  createWindow();
  
  // Register the global shortcut (Ctrl+A+L)
  globalShortcut.register('CommandOrControl+A+L', async () => {
    try {
      // Check if API key is set
      const apiKey = store.get('geminiApiKey');
      if (!apiKey) {
        // Show the main window if it's hidden
        if (mainWindow) {
          if (mainWindow.isMinimized()) mainWindow.restore();
          mainWindow.show();
          mainWindow.focus();
        }
        return;
      }
      
      // Get text from clipboard directly
      const selectedText = clipboard.readText();
      console.log('Clipboard content:', selectedText); // Debug log
      
      // Make sure we're not trying to process the API key
      if (!selectedText || selectedText.trim() === '' || selectedText === apiKey) {
        return;
      }
      
      // Send the text to renderer for processing
      mainWindow.webContents.send('process-text', selectedText);
    } catch (error) {
      console.error('Error in shortcut handler:', error);
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// IPC handlers
ipcMain.handle('save-api-key', (event, apiKey) => {
  store.set('geminiApiKey', apiKey);
  return true;
});

ipcMain.handle('get-api-key', () => {
  return store.get('geminiApiKey') || '';
});

ipcMain.handle('write-to-clipboard', (event, text) => {
  clipboard.writeText(text);
  return true;
});

// Add window visibility handlers
ipcMain.handle('hide-window', () => {
  if (mainWindow) {
    mainWindow.hide();
  }
  return true;
});

ipcMain.handle('show-window', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
  return true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Mark app as quitting to actually close the window
  app.isQuitting = true;
});

app.on('will-quit', () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});
