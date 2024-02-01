const Sequelize = require('sequelize')
const {db} = require("../dataBase/db.js")
 

const Reply = db.define('replies',{
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

module.exports = Reply