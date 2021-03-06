const electron = require('electron')
const url = require('url')
const path = require('path')
const fs = require('fs')

const {app, BrowserWindow, ipcMain} = electron

let mainWindow, newItemWindow
const closeApp = () => {
    if(process.platform !== 'darwin')
        app.quit()
}

const startApp = () =>{
    mainWindow = new BrowserWindow({
        width:500, 
        height: 600, 
        resizable: false,
        frame: false, 
        show: false
    })
    // mainWindow.setMenu(null)
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'/html/home.html'),
        protocol: 'file',
        slashes: true
    }))
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
    mainWindow.on('closed', ()=>{
        mainWindow = null
        newItemWindow = null
        closeApp()
    })
}

const openAddWindow = () => {
    newItemWindow = new BrowserWindow({
        width: 600, 
        height: 300, 
        resizable: false,
        frame: false, 
        show: false
    })
    newItemWindow.loadURL(url.format({
        pathname: path.join(__dirname,'/html/newItem.html'),
        protocol: 'file',
        slashes: true
    }))
    newItemWindow.once('ready-to-show', () => {
        newItemWindow.show()
    })
    newItemWindow.on('closed', ()=>{
        newItemWindow = null
    })
}

// * app related events
app.on('ready', startApp)
app.on('window-all-closed', closeApp)

// * ipc events/catches
ipcMain.on('first-time-completed', ()=>{
    try{
        const css = fs.openSync('src/css/main.css', 'a')
        const rule = '\n.first-time{display:none}'
        fs.appendFileSync(css, rule)
    } catch(err) {
        console.log(err)
    }
})

ipcMain.on('new-item', openAddWindow)

ipcMain.on('add', (event, state)=>{
    mainWindow.webContents.send('adding', state)
    newItemWindow.close()
})

ipcMain.on('close', (event)=>{
    BrowserWindow.fromWebContents(event.sender).close()
    if(BrowserWindow.fromWebContents(event.sender)===mainWindow)
        closeApp()
})
ipcMain.on('minimize', (event)=>{
    BrowserWindow.fromWebContents(event.sender).minimize()
})