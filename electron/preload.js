const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  getAppName: () => ipcRenderer.invoke('app-name'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  platform: process.platform,
  
  // Add app-specific APIs here
  showNotification: (title, body) => {
    new Notification(title, { body });
  },
  
  // Check if running in Electron
  isElectron: true
});

// Add custom CSS for Electron-specific styling
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('electron-app');
  
  // Add Electron-specific styles
  const style = document.createElement('style');
  style.textContent = `
    .electron-app {
      -webkit-app-region: no-drag;
    }
    
    .electron-app .navbar {
      -webkit-app-region: drag;
    }
    
    .electron-app .navbar .nav-toggle,
    .electron-app .navbar .nav-menu,
    .electron-app .navbar .nav-link,
    .electron-app .navbar .dark-mode-text {
      -webkit-app-region: no-drag;
    }
    
    /* Hide PWA install prompt in Electron */
    .electron-app #pwa-install-container {
      display: none !important;
    }
    
    /* Electron-specific scrollbar styling */
    .electron-app ::-webkit-scrollbar {
      width: 8px;
    }
    
    .electron-app ::-webkit-scrollbar-track {
      background: var(--bg-light);
    }
    
    .electron-app ::-webkit-scrollbar-thumb {
      background: var(--primary-color);
      border-radius: 4px;
    }
    
    .electron-app ::-webkit-scrollbar-thumb:hover {
      background: var(--secondary-color);
    }
  `;
  document.head.appendChild(style);
});
