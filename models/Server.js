const express = require('express')
const { dbConnection } = require('../config/config.js')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()
 
class Server{
    constructor(){
        this.app = express()
        this.PORT = process.env.PORT || 5000
        this.host = process.env.HOST || '0.0.0.0'
        this.paths = {
            authRoutes:"/",
            productRoutes:"/product",
            orderRoutes:"/order",
            categoryRoutes:"/category",
            searchRoutes:'/search',
            paymentRoutes:'/payment',
            invoiceRoutes:'/invoice',
            commentRoutes:'/comment',
        }
        
        
        //Midlewares 
        this.middlewares()
        
        //rutas de mi applicacion
        this.routes()

        
        //conectar a base de datos
        this.conectarDB()
        //sockets
 
    }


    middlewares(){
        this.app.use(express.static('public'))
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({extended:true}))
        //habilitar cookie parser
        this.app.use(cookieParser())
        this.app.use(cors())
        //habilitar ejs como template engine
        this.app.set("view engine",'ejs')
        //ubicacion vistas
        this.app.set("views",path.join(__dirname,'../views'))
    }

    routes(){
    
        this.app.use(this.paths.authRoutes, require("../routes/authRoutes.js"))
        this.app.use(this.paths.productRoutes, require("../routes/productRoutes.js"))
        this.app.use(this.paths.categoryRoutes, require("../routes/categoryRoutes.js"))
        this.app.use(this.paths.searchRoutes, require("../routes/searchRoutes.js"))
        this.app.use(this.paths.paymentRoutes, require("../routes/paymentRoutes.js"))
        this.app.use(this.paths.orderRoutes, require("../routes/orderRoutes.js"))
        this.app.use(this.paths.invoiceRoutes, require("../routes/invoiceRoutes.js"))
        this.app.use(this.paths.commentRoutes, require("../routes/commentRoutes.js"))
 
    }
 
    listen(){
        this.app.listen(this.PORT,this.HOST, ()=>{
            console.log("Servidor corriendo en puerto", this.PORT)
        })
      
    }

    async conectarDB(){
        await dbConnection()
    }
}


module.exports = Server