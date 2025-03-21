/**
 *  Processi de renderização do documento sobre.html
 */

// enviar uma mensagem para o processo principal fechar a janela sobre
function fechar() {
    // Executar a função aboutExit() vinculada ao preload.js, atráves da api do electron (ipcRenderer)
    api.aboutExit()
}