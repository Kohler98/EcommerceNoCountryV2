const {db} = require("../dataBase/db.js")
 
 

 
// importar el modelo de usuarios de la carpeta models
 
 
const dbConnection = async() =>{
    try{
        require("../models/index.js")
        
        await db.authenticate()
        db.sync()
        console.log("Conectado a la base de datos")
    }catch(error){
        console.log("Hubo un error ", error)
    }
}

module.exports = {
    dbConnection
}