/**
 *  Processo de renderização do documento index.html
 */

console.log("Processo de renderização")

// Estratégia para renderizar(desenhar) as notas adesivas
// Usar uma lista para preencher de forma dinâmica os itens(notas)

// Vetor global para manipular os dados do banco
let arrayNotes = []

// Captura do id da lista <ul> do documento index.html
const list = document.getElementById('listNotes')

// inserção da data no rodapé
function obterData() {
    const data = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return data.toLocaleDateString('pt-BR', options)
}

document.getElementById('dataAtual').innerHTML = obterData()

// Troca do ícone do banco de dados (status de conexão)
// Uso de api do preload.js
api.dbStatus((event, message) => {
    // Teste de recebimento da mensagem
    console.log(message)
    if (message === "conectar") {
        document.getElementById('icon').src="../public/img/dbon.png"
    } else {
        document.getElementById('icon').src="../public/img/dboff.png"
    }
})

// ===========================================================
// == CRUD READ ==============================================

// Passo 1: Enviar ao main um pedido para listar as notas
api.listNotes()

// Passo 5: Recebimento das notas via IPC e renderização(desenho) das notas no documento index.html
api.renderNotes((event, notes) => {
    const renderNotes = JSON.parse(notes) // JSON.parse converte de string para JSON
    console.log(renderNotes) // teste de recebimento (passo 5)
    // Renderizar no index.html o conteúdo do array
    arrayNotes = renderNotes // Atribuir ao vetor o JSON recebido
    // Uso do laço forEach para percorrer o vetor e extrair os dados
    arrayNotes.forEach((n) => {
        // Adição de tags <li> no documento index.html
        list.innerHTML += `
            <br>
            <li>
                <p>${n._id}</p>
                <p>${n.texto}</p>
                <p>${n.cor}</p>
            </li>
            
        `
    })
})

// == FIM - CRUD READ ========================================
// ===========================================================