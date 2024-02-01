// nombre, apellido, password , correo, pais, estado, ciudad, codigoPostal,
const Sequelize = require('sequelize')
const {db} = require("../dataBase/db.js")
 
 
 
const Productos = db.define('productos',{
    id:{
        type:Sequelize.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue: Sequelize.UUIDV4,
    },
    titulo:{
        type: Sequelize.STRING(120),
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'El nombre no puede estar vacio'
            }
        }

    },
    precio:{
        type: Sequelize.FLOAT,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'El precio no puede estar vacio'
            }
        }
        
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false
        
    },
    in_stock:{
        type: Sequelize.INTEGER,
        defaultValue:1

    },
    marca:{
        type:Sequelize.STRING(50),
        allowNull:true,
        defaultValue:'Generic'
    },
    envio:{
        type:Sequelize.BOOLEAN,
        allowNull:true,
        defaultValue:false,
    },
    porcentaje:{
        type:Sequelize.FLOAT,
        allowNull:true,
        defaultValue:0,
    },
    descuento:{
        type:Sequelize.FLOAT,
        allowNull:true,
        defaultValue:0,
    },
    descripcion:{
        type:Sequelize.STRING(500),
        allowNull:true,
    },
    activo:{
        type:Sequelize.BOOLEAN,
        defaultValue:true
    },
    imagen:Sequelize.TEXT,
},{
    hooks:{
        beforeCreate:(producto)=>{
            producto.descuento = producto.precio*(producto.porcentaje/100)
        }
    }
})


 
module.exports = Productos;