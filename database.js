const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017'

let connected = false

const connectDB = async () => {
    if (!connected) {
        try {
            await mongoose.connect(url)
            connected = true
            console.log("MongoDB Conectado")
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

const disconnectDB = async () => {
    if (connected) {
        try {
            await mongoose.disconnect(url)
            connected = false
            console.log("MongoDB Desconectado")
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

module.exports = { connectDB, disconnectDB }