const {Sequelize} = require('sequelize')
 
require('dotenv').config()

const db = new Sequelize(process.env.BASE_URL,{
    host:process.env.BD_HOST,
    port:process.env.BD_PORT,
    dialect : 'postgres',
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    },
    
})
module.exports ={ 
    db
}