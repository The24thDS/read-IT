const electron = require('electron')
const {ipcRenderer, shell} = electron
const PouchDB = require('pouchdb-browser')
const list = document.querySelector('.list')
const add = document.querySelector('.add')
const db = new PouchDB('readIT')


const linkClick = event => {
    event.preventDefault()
    shell.openExternal(event.target.attributes.href.value)
}

// * adding
const insertInPage = (item) => {
    if(!list.childElementCount)
        list.innerHTML = ''
    let itemHTML = ``;
    if(item.url)
        itemHTML = `
            <div class="item" data-id="${item._id}">
                <div onclick="checkboxClick(event)" class="checkbox ${item.completed?'checked':''}"></div>
                <a onclick="linkClick(event)" href="${item.url}" target="_blank">
                    ${item.name}
                </a>
            </div>
        `
    else
        itemHTML = `
            <div class="item" data-id="${item._id}">
                <div onclick="checkboxClick(event)" class="checkbox ${item.completed?'checked':''}"></div>
                <a>
                    ${item.name}
                </a>
            </div>
        `
    list.innerHTML += itemHTML
}

const addItem = async(data) => {
    const item = {
        _id: new Date().toISOString(),
        name: data.name,
        url: data.url,
        completed: false
    };
    try{
        const response = await db.put(item)
        insertInPage(item)
    } catch(err) {
        console.log(err)
    }
}

// * getting and first time
const firstTime = () => {
    const firstTimeInput = document.querySelector('.first-time input')
    const firstTimeButton = document.querySelector('.first-time button')
    firstTimeButton.addEventListener('click', async()=>{
        const username = firstTimeInput.value
        const user = {
            _id: 'username',
            value: username
        }
        try{
            const response = await db.put(user)
            onLoad()
        } catch(err) {
            console.log(err)
        }
    })
}
const getItems = async() => {
    const doc = await db.allDocs({include_docs: true, descending: true})
    doc.rows.forEach(element => {
        insertInPage(element.doc)
    })
}
const onLoad = async() => {
    // * check if name is set
    try{
        const name = await db.get('username')
        if(!list.childElementCount)
            list.innerHTML = 'Looks like you have nothing to read'
        document.querySelector('.first-time').remove()
        document.querySelector('.greetings h2').innerHTML = `Hello, ${name.value}!`
    } catch(err) {
        if(err.message==='missing')
            firstTime()
    }
}

// * removal
const removeItem = async(event) => {
    try {
        const _id = event.parentElement.attributes['data-id'].value
        const doc = await db.get(_id)
        if(!event.classList.value.includes('checked'))
            throw "Canceled"
        const response = await db.remove(doc)
        event.parentElement.remove()
        if(!list.childElementCount)
            list.innerHTML = 'Looks like you have nothing to read'
    } catch (err) {
        console.log(err)
    }
}
const checkboxClick = event => {
    let opacity = 0.5
    if(event.target.classList.value.includes('checked')) 
        opacity = 1
    event.target.parentElement.style = `opacity: ${opacity}`
    event.target.classList.toggle('checked')
    window.setTimeout(()=>{
        removeItem(event.target)
    },2000)
}

// * ipc related
add.addEventListener('click', ()=>{
    ipcRenderer.send('new-item')
})
ipcRenderer.on('adding', (event, state)=>{
    addItem(state)
})