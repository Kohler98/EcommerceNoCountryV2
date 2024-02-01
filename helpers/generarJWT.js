const jwt = require('jsonwebtoken')
const Usuarios = require('../models/Usuario')
require('dotenv').config({path:'variables.env'})
const generarJWT = (uid = 's') =>{
    return new Promise((resolve,reject)=>{
        const payload = {uid}

        jwt.sign(payload,process.env.SECRETPRIVATEKEY,{
            expiresIn:'4h'
        },(err,token)=>{
            if(err){
 
                reject('No se pudo generar el token')
            }else{
 
                resolve(token)
            }
        })

    })
}
const comprobarJWT = async(token = '') => {

    try {
        if (token.length < 10) 
            return null;

        const { uid } = jwt.verify(token, process.env.SECRETPRIVATEKEY);
        const usuario = await Usuarios.findByPk(uid)

        if (usuario) {
            if (usuario.estado)
                return usuario;
            else return null;
        } else return null;

    } catch (error) {
        return null;
    }
}


const generarId = () => Math.random().toString(32).substring(2) +Date.now().toString()
module.exports = {
    generarJWT,
    comprobarJWT,
    generarId
}