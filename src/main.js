const electron = require('electron')
const url = require('url')
const path = require('path')

const {app, BrowserWindow, ipcMain, Menu} = electron

let mainWindow, newItemWindow
const closeApp = () => {
    if(process.platform !== 'darwin')
        app.quit()
}

const startApp = () =>{
    mainWindow = new BrowserWindow({width:500, height: 600, frame: false})
    //mainWindow.setMenu(null)
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'/html/home.html'),
        protocol: 'file',
        slashes: true
    }))
    mainWindow.on('closed', ()=>{
        mainWindow = null
        newItemWindow = null
        closeApp()
    })
}



// * app related events
app.on('ready', startApp)
app.on('window-all-closed', closeApp)

// * ipc events/catches
ipcMain.on('close', closeApp)
ipcMain.on('minimize', ()=>{mainWindow.minimize()})