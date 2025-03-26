/**
 *  Processo de renderização do documento nota.html
 */

// para "debugar" e testar a aplicação é necessário ativar as ferramentas do desenvolvendor <Ctrl><shift><i>

// Capturar o foco da caixa de texto
const foco = document.getElementById('inputNote')

// Alterar as propriedades do documento html ao iniciar a aplicação
document.addEventListener('DOMContentLoaded', () => {
    foco.focus() //iniciar o documento com o foco na caixa de texto
})

// Capturar os dados do formulário (passo 1: - fluxo)
let frmNote = document.getElementById('frmNote')
let note = document.getElementById('inputNote')
let color = document.getElementById('selectColor')

// =====================================================
// == CRUD Create ======================================

// Evento relacionamento ao botão submit
frmNote.addEventListener('submit', async (event) => {
    // evitar o comportamento padrão (recarregar a página)
    event.preventDefault()
    // IMPORTSNTE! (teste de recebimneto dos dados do form - Passo 1)
    console.log(note.value, color.value)
    // Criar um objeto para enviar ao main os dados da nota
    const stickyNote = {
        textNote: note.value,
        colorNote: color.value
    }
    // Enviar o objeto para o main (Passo 2: fluxo)
    api.createNote(stickyNote)
})

// == Fim - CRUD Create ==================================
// =======================================================