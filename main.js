const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog } = require('electron/main')
const path = require('node:path')
const { connectDB, disconnectDB } = require('./database.js')
const noteModel = require('./src/models/Nodes.js')

let win
const createWindow = () => {
  nativeTheme.themeSource = 'light'
  win = new BrowserWindow({
    width: 1010,
    height: 720,
    //frame: false,
    //resizable: false,
    //minimizable: false,
    //closable: false,
    //autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  win.loadFile('./src/views/index.html')
}

let about
function aboutWindow() {
  nativeTheme.themeSource = 'light'
  const mainWindow = BrowserWindow.getFocusedWindow()
  if (mainWindow) {
    about = new BrowserWindow({
      width: 300,
      height: 200,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      parent: mainWindow,
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  }

  about.loadFile('./src/views/sobre.html')

  ipcMain.on('about-exit', () => {
    if (about && !about.isDestroyed()) {
      about.close()
    }
  })
}

let note
function noteWindow() {
  nativeTheme.themeSource = 'light'
  const mainWindow = BrowserWindow.getFocusedWindow()
  if (mainWindow) {
    note = new BrowserWindow({
      width: 400,
      height: 270,
      autoHideMenuBar: true,
      //resizable: false,
      //minimizable: false,
      parent: mainWindow,
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  }
  note.loadFile('./src/views/nota.html')
}

app.whenReady().then(() => {
  createWindow()

  ipcMain.on('db-connect', async (event) => {
    const connected = await connectDB()
    if (connected) {
      setTimeout(() => {
        event.reply('db-status', "conectar")
      }, 200)
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', async () => {
  await disconnectDB()
})

app.commandLine.appendSwitch('log-level', '3')

const template = [
  {
    label: 'Notas',
    submenu: [
      {
        label: 'Criar nota',
        accelerator: 'Ctrl+N',
        click: () => noteWindow()
      },
      {
        type: 'separator'
      },
      {
        label: 'Sair',
        accelerator: 'Alt+F4',
        click: () => app.quit()
      }
    ]
  },
  {
    label: 'Ferramentas',
    submenu: [
      {
        label: 'Ampliar zoom',
        role: 'zoomIn'
      },
      {
        label: 'Reduzir',
        role: 'zoomOut'
      },
      {
        label: 'Restaurar o zoom padrão',
        role: 'resetZoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Recarregar',
        click: () => updateList()
      }
    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Repositório',
        click: () => shell.openExternal('https://github.com/Jean-Soares9/stickynotes')
      },
      {
        label: 'Sobre',
        click: () => aboutWindow()
      }
    ]
  }
]

ipcMain.on('create-note', async (event, stickyNote) => {
  try {
    const newNote = noteModel({
      texto: stickyNote.textNote,
      cor: stickyNote.colorNote
    })
    newNote.save()
    event.reply('reset-form')
  } catch (error) {
    console.log(error)
  }
})

ipcMain.on('list-notes', async (event) => {
  try {

    const notes = await noteModel.find()
    console.log(notes)
    event.reply('render-notes', JSON.stringify(notes))
  } catch (error) {
    console.log(error)
  }
})

ipcMain.on('update-list', () => {
  updateList()
})

function updateList() {
  if (win && !win.isDestroyed()) {
    win.webContents.send('main-reload')
    setTimeout(() => {
      win.webContents.send('db-status', "conectar")
    }, 200)
  }
}

ipcMain.on('delete-note', async (event, id) => {
  console.log(id)
  const { response } = await dialog.showMessageBox(win, {
    type: 'warning',
    title: "Atenção",
    message: "Tem certeza que deseja excluir esta nota?\nEsta ação não poderá ser desfeita.",
    buttons: ['Cancelar', 'Excluir']
  })
  if (response === 1) {
    try {
      const deleteNote = await noteModel.findByIdAndDelete(id)
      updateList()
    } catch (error) {
      console.log(error)
    }

  }

})
