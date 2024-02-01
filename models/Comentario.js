const Sequelize = require('sequelize')
const {db} = require("../dataBase/db.js")
 
const Comentarios = db.define('comentario',{
    id:{
        type:Sequelize.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue: Sequelize.UUIDV4,
    },
    mensaje:Sequelize.TEXT
},{
    timestamps:false
})


module.exports = Comentarios