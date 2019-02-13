const close = document.querySelector('.fa-times')
const minimize = document.querySelector('.fa-window-minimize')
close.addEventListener('click', ()=>{
    ipcRenderer.send('close')
})
minimize.addEventListener('click', ()=>{
    ipcRenderer.send('minimize')
})