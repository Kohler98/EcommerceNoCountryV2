// nombre, apellido, password , correo, pais, estado, ciudad, codigoPostal,
const Sequelize = require('sequelize')
const {db} = require("../dataBase/db.js")
 
 
const Pedidos = db.define('pedidos',{
    id:{
        type:Sequelize.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue: Sequelize.UUIDV4,
    },nombre:{
        type: Sequelize.STRING(50),
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'El nombre no puede estar vacio'
            }
        }

    },
    apellido:{
        type: Sequelize.STRING(50),
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'El nombre no puede estar vacio'
            }
        }

    },email:{
        type:Sequelize.STRING(60),
        allowNull:false,
        validate:{
            isEmail:{
                msg:'Agrega un correo valido'
            }
        }
    },
    pais:Sequelize.STRING(30),
    estado:Sequelize.STRING(30),
    ciudad:Sequelize.STRING(30),
    line1:Sequelize.STRING(150),
    postal_code:Sequelize.STRING(150),
    phone:Sequelize.INTEGER,
    productos:{
        type:Sequelize.ARRAY(Sequelize.JSON),
        allowNull:true,
        defaultValue:[]
    }

})


module.exports = Pedidos;