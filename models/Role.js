// Importing Sequelize module
const Sequelize = require('sequelize')

// Importing database configuration
const {db} = require("../dataBase/db.js")

// Defining Role model

const Role = db.define('roles',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,

    },
    role: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
    }
}) 
 
db.sync().then(async() => {
    const existeTabla = (await db.getQueryInterface().showAllTables()).includes('roles')
    if(existeTabla){
        const role = await Role.findAll()
 
     
        if(role.length<=0){
            try {
                await Role.create({role:'ADMIN_ROLE'})
                await Role.create({role:'USER_ROLE'})
            } catch (error) {
                console.log(error)
            }
 
        }
        
    } 

  });
// Exporting Role model
module.exports = Role;
 