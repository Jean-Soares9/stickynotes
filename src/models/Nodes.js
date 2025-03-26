/**
 *  Modelo de dados das notas
 *  Criação da coleção
 */

// Importação dos recursos do mongoose
const { model, Schema } = require('mongoose')

// Criação da estrutura da coleção
const noteSchema = new Schema({
    texto: {
        type: String
    },
    cor: {
        type: String
    }
}, {versionKey: false})

// Exportar o modelo de dados para o main
module.exports = model('Notas', noteSchema)