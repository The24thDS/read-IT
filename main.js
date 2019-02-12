const electron = require('electron')
const url = require('url')
const path = require('path')

const {app, BrowserWindow, ipcMain, Menu} = electron

let mainWindow, newItemWindow

const startApp = () =>{
    mainWindow = new BrowserWindow({width:500, height: 600})
    //mainWindow.setMenu(null)
    mainWindow.loadFile('home.html')
    mainWindow.on('closed', ()=>{
        mainWindow = null
        newItemWindow = null
        app.quit()
    })
}

const openList = (event) => {
    mainWindow.loadFile('list.html')
    console.log("test")
}

// * app related events
app.on('ready', startApp)
app.on('window-all-closed', ()=>{
    if(process.platform !== 'darwin')
        app.quit()
})

// * ipc events/catches
ipcMain.on('list-click', openList)