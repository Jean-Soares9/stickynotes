console.log("Electron - Processo Principal")

// Importação dos recursos do framework
// app (aplicação)
// BrowserWindow (Criação da janela)
// nativeTheme (definir tema claro ou escuro)
// Menu (definir um menu personalizado)
// shell (acessar links externos no navegador padrão)
const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron/main')

// Ativação do preload.js (importação do path)
const path = require('node:path')

// Importação dos metodos conectar e desconectar (modulo de conexão)
const { conectar, desconectar } = require('./database.js')

// Janela principal
let win
const createWindow = () => {
  // definindo tema da janela claro ou escuro
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

  // Carregar o menu personalizado
  // Atenção! Antes importar o recurso Menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  // carregar o documunte html na janela
  win.loadFile('./src/views/index.html')
}

// Janela sobre
let about
function aboutWindow() {
  nativeTheme.themeSource='light'
  // Obter a janela prinipal
const mainWindow = BrowserWindow.getFocusedWindow()
// validação (se existir a janela principal)
if (mainWindow) {
  about = new BrowserWindow({
    width: 300,
    height: 200,
    autoHideMenuBar: true,
    resizable: false,
    minimizable: false,
    // estabelecer uma relação hierarquica entre janelas
    parent: mainWindow,
    // criar uma janela modal (só retorna a principal quando encerrada)
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
}
  
  about.loadFile('./src/views/sobre.html')

  // Recebimento da mensagem do renderizador da tela sobre para fechar a janela usando o botão ok
  ipcMain.on('about-exit', () => {
    // Validação (se existir a janela e ela não estiver destruída, fechar)
    if(about && !about.isDestroyed()) {
      about.close()
    }
    
  })
}

// Janela nota
let note
function noteWindow() {
  nativeTheme.themeSource='light'
  // Obter a janela prinipal
const mainWindow = BrowserWindow.getFocusedWindow()
// validação (se existir a janela principal)
if (mainWindow) {
  note = new BrowserWindow({
    width: 400,
    height: 270,
    autoHideMenuBar: true,
    resizable: false,
    minimizable: false,
    // estabelecer uma relação hierarquica entre janelas
    parent: mainWindow,
    // criar uma janela modal (só retorna a principal quando encerrada)
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
}
  
  note.loadFile('./src/views/nota.html')

}

// inicialização da aplicação (assincronismo)
app.whenReady().then(() => {
  createWindow()

  // Melhor local para estabelecer a conexão com o banco de dados
  // No MongoDB é mais eficiente manter uma única conexão aberta
  // durante todo o tempo de vida do aplicativo e encerrar a conexão 
  // quando o aplicativo for finalizado
  // ipcMain.on (receber mensagem)
  // db-connect (rótulo da mensagem)
  ipcMain.on('db-connect', async (event) => {
    const conectado = await conectar()
    if (conectado) {
// Enviar ao renderizador uma mensagem para trocar a imagem do ícone do status do banco
    //de dados (criar um delay de 0.5 ou 1s para sincronização com a nuvem)
    setTimeout(() => {
      // Enviar ao renderizador a mensagem "conectado"
      // db-status (IPC - comunicação entre processos - preload.js)
      event.reply('db-status', "conectar")
    }, 500) // 500ms = 0.5s
    }    
  })

  // só ativar a janela principal se nenhuma outra estiver ativa
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// se o sistema não for MAC encerrar a aplicação quando a janela for fechada
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IMPORTANTE! Desconectar do banco de dados quando a aplicação for finalizada
app.on('before-quit', async () => {
  await desconectar()
})

// Reduzir a verbosidade de logs não criticos (devtools)
app.commandLine.appendSwitch('log-level','3')

// template do menu
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
        role: 'reload'
      },
      {
        label: 'DevTools',
        role: 'toggleDevTools'
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

