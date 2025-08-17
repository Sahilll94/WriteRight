const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use IPC
contextBridge.exposeInMainWorld('api', {
  // Send API key to main process for storage
  saveApiKey: (apiKey) => ipcRenderer.invoke('save-api-key', apiKey),
  
  // Get API key from main process
  getApiKey: () => ipcRenderer.invoke('get-api-key'),
  
  // Write corrected text to clipboard
  writeToClipboard: (text) => ipcRenderer.invoke('write-to-clipboard', text),
  
  // Window management
  hideWindow: () => ipcRenderer.invoke('hide-window'),
  showWindow: () => ipcRenderer.invoke('show-window'),
  
  // Listen for events from main process
  onProcessText: (callback) => {
    ipcRenderer.on('process-text', (event, text) => callback(text));
    return () => {
      ipcRenderer.removeAllListeners('process-text');
    };
  },
  
  // Listen for status updates from main process
  onStatusUpdate: (callback) => {
    ipcRenderer.on('status-update', (event, message, type) => callback(message, type));
    return () => {
      ipcRenderer.removeAllListeners('status-update');
    };
  }
});
