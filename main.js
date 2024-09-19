const {app, BrowserWindow, globalShortcut, screen} = require('electron');
const path = require("node:path");

let mainWindow = null;
let isFloating = false;

function createWindow() {
    const {width, height} = screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, 'icons', process.platform === 'win32' ? 'icon.ico' : process.platform === 'darwin' ? 'icon.icns' : 'icon.png')
    });

    mainWindow.loadURL('https://www.perplexity.ai');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function toggleFloatingMode() {
    if (!mainWindow) return;

    isFloating = !isFloating;
    const {width, height} = screen.getPrimaryDisplay().workAreaSize;

    if (isFloating) {
        // Set floating mode
        mainWindow.setAlwaysOnTop(true, 'floating');
        mainWindow.setVisibleOnAllWorkspaces(true);
        mainWindow.setFullScreenable(false);

        // Adjust size and position for floating mode
        const floatingWidth = Math.min(500, width * 0.3);
        const floatingHeight = Math.min(400, height * 0.5);
        mainWindow.setSize(floatingWidth, floatingHeight);
        mainWindow.setPosition(width - floatingWidth - 20, height - floatingHeight - 40);
    } else {
        // Revert to normal mode
        mainWindow.setAlwaysOnTop(false);
        mainWindow.setVisibleOnAllWorkspaces(false);
        mainWindow.setFullScreenable(true);

        // Reset to default size and center the window
        mainWindow.setSize(800, 600);
        mainWindow.center();
    }
}

function toggleWindow() {
    if (mainWindow === null) {
        createWindow();
    } else if (mainWindow.isVisible()) {
        mainWindow.hide();
    } else {
        mainWindow.show();
    }
}

app.whenReady().then(() => {
    createWindow();
    // Register global hotkey for toggling window visibility (Cmd+Shift+P for macOS, Ctrl+Shift+P for Windows)
    //const visibilityHotkey = process.platform === 'darwin' ? 'Command+Shift+P' : 'Ctrl+Shift+P';
    //globalShortcut.register(visibilityHotkey, toggleWindow);
    // Register global hotkey for toggling floating mode (Cmd+Shift+F for macOS, Ctrl+Shift+F for Windows)
    //const floatingHotkey = process.platform === 'darwin' ? 'Command+Shift+F' : 'Ctrl+Shift+F';
    //globalShortcut.register(floatingHotkey, toggleFloatingMode);
});

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

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
