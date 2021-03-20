const { app, BrowserWindow, ipcMain, dialog } = require('electron')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    //win.webContents.openDevTools()
    win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on('selectPhoto', (event) => {
    const dialogOptions = {
        title: 'Sélection du média',
        buttonLabel: 'Valider',
        properties: ['openFile'],
        filters: [
            { name: 'Photo', extensions: ['jpg', 'png'] },
            { name: 'Video', extensions: ['mp4'] }
        ]
    }
    const filePath = dialog.showOpenDialogSync(dialogOptions)
    if (filePath !== undefined) {
        const pathSplit = filePath[0].split('.')
        const extension = pathSplit[pathSplit.length - 1]
        if (extension.toLowerCase() == 'mp4') {
            event.reply('selectedPhoto', filePath, true)
        } else {
            event.reply('selectedPhoto', filePath, false)
        }

    }


})

/*try {
    require('electron-reloader')(module);
} catch { }
*/