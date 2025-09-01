# CodeCatalyst AI - Installable Apps

This project can be installed as multiple types of applications:

## 📱 Progressive Web App (PWA)

The easiest way to install the app on any device:

### Installation Instructions:

1. **Desktop (Chrome, Edge, Firefox):**
   - Visit the website
   - Look for the install button in the address bar (➕ icon)
   - Click "Install CodeCatalyst AI"
   - The app will be installed like a native application

2. **Mobile (Android/iOS):**
   - Open the website in your mobile browser
   - For Android: Tap "Add to Home Screen" or look for the install prompt
   - For iOS: Tap the Share button and select "Add to Home Screen"

3. **Features:**
   - ✅ Works offline
   - ✅ Push notifications (optional)
   - ✅ App-like experience
   - ✅ Auto-updates
   - ✅ Cross-platform compatibility

---

## 🖥️ Desktop Application (Electron)

For a native desktop experience on Windows, Mac, and Linux:

### Build Instructions:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Development mode:**
   ```bash
   npm run electron-dev
   ```

3. **Build for your platform:**
   ```bash
   # Build for current platform
   npm run dist
   
   # Build for all platforms (requires additional setup)
   npm run build-electron
   ```

4. **Install the generated installer:**
   - Windows: `dist-electron/CodeCatalyst AI Setup.exe`
   - Mac: `dist-electron/CodeCatalyst AI.dmg`
   - Linux: `dist-electron/CodeCatalyst AI.AppImage`

### Features:
- ✅ Native desktop application
- ✅ Auto-updates
- ✅ System integration
- ✅ Offline functionality
- ✅ Custom menus and shortcuts

---

## 🦀 Lightweight Desktop App (Tauri) - Optional

For an even lighter desktop application:

### Prerequisites:
- Rust installed (https://rustup.rs/)
- Node.js and npm

### Setup:
```bash
# Install Tauri CLI
npm install -g @tauri-apps/cli

# Initialize Tauri (run once)
npx tauri init

# Development
npx tauri dev

# Build
npx tauri build
```

---

## 🚀 Quick Start

### For Users:
1. **Easiest**: Visit the website and install as PWA
2. **Desktop**: Download the appropriate installer from releases

### For Developers:
1. Clone the repository
2. Choose your preferred build method
3. Follow the build instructions above

---

## 📦 Available Platforms

| Platform | PWA | Electron | Tauri |
|----------|-----|----------|-------|
| Windows  | ✅  | ✅       | ✅    |
| macOS    | ✅  | ✅       | ✅    |
| Linux    | ✅  | ✅       | ✅    |
| Android  | ✅  | ❌       | ❌    |
| iOS      | ✅  | ❌       | ❌    |

---

## 🛠️ Development Commands

```bash
# PWA (no build needed - works directly)
# Just serve the files with any web server

# Electron Development
npm run electron-dev        # Run in development mode
npm run pack                # Package without installer
npm run dist                # Build installer for current OS

# Install Electron dependencies
npm install electron electron-builder --save-dev
```

---

## 📱 PWA Features

- **Offline Mode**: Full functionality without internet
- **Install Prompt**: Automatic installation suggestion
- **Background Sync**: Form submissions work offline
- **Push Notifications**: Optional engagement features
- **App-like Experience**: Full-screen, native feel

---

## 🔧 Customization

### App Icons:
- PWA: `images/robot.svg` (automatically generated sizes)
- Electron: `electron/assets/icon.*` (ico, icns, png)

### App Configuration:
- PWA: `manifest.json`
- Electron: `package.json` build section

### Branding:
- Update `manifest.json` for PWA details
- Update `package.json` for Electron app details
- Replace icons in respective directories

---

## 🚨 Important Notes

1. **PWA**: Requires HTTPS in production (works on localhost for development)
2. **Electron**: Large file size (~150MB) but full native features
3. **Tauri**: Smallest size (~10MB) but requires Rust ecosystem
4. **Code Signing**: Required for distribution on app stores

---

## 📞 Support

For issues or questions:
- Email: salimuddinsaiyed5@gmail.com
- Website: CodeCatalyst AI platform

Happy coding! 🚀
