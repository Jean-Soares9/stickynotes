const { model, Schema } = require('mongoose')


const noteSchema = new Schema({
    texto: {
        type: String
    },
    cor: {
        type: String
    }
}, { versionKey: false })


module.exports = model('Notas', noteSchema)