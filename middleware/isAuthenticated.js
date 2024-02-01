const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const Usuarios = require('../models/Usuario')
require('dotenv').config({path:'variables.env'})

const isAuthenticated = async(req = request, res = response, next) =>{
    const token = req.header('x-token')

    if (!token){
        return res.status(401).json({
            msg:'No hay token en la peticion'
        })
    }
    try{
        const {uid} = jwt.verify(token,process.env.SECRETPRIVATEKEY)
        const {id} = uid
 
        //leer el usuario que corresponde al uid
        const usuario = await Usuarios.findByPk(id)
      
        if(!usuario){
            return res.status(401).json({
                msg:'Usuario no registrado en la base de datos'
            })

        }
        //verificar si el uid tiene estado true
        if (!usuario.activo){
            return res.status(401).json({
                msg:'Token no valido - usuario con estado en false'
            })
        }

        req.usuario = usuario

        next()
    }catch(error){
 
        res.status(401).json({
            msg:'Token no valido'
        })
    } 
}   

module.exports = {
    isAuthenticated
}