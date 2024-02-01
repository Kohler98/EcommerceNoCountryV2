const Role = require("../models/Role");
const Usuarios = require("../models/Usuario");

const isValidRole = async(rol= '')=>{
    const existeRole = await Role.findOne({where:{role:rol}})
 
    if(!existeRole){
        throw new Error(`El role ${rol} no esta registrado en la base de datos`)
    }
}
const isValidEmail = async(correo = '') =>{
    const existeEmail = await Usuarios.findOne({where:{email:correo}})
 
    if (existeEmail){
        
         throw new Error("El correo ya esta registrado")
        
    }
}
const authorizeRoles = (...roles) => {
  return (req,res =response, next) =>{

    if (!roles.includes(req.usuario.role)) {
      return res.status(403).json({
        msg:`Role (${req.usuario.role}) no te autoriza a ingresar a este recurso`
      })
    }
    
    next();
  }
 
  };
const comprobarToken = async(req, res, next) =>{
 
    const {token} = req.params
    const usuario = await Usuarios.findOne({where:{token}})
    if (!usuario) {
      return res.status(403).json({
        msg:'El token no es valido'
      })
    }
    
    next();
 
}
module.exports = {
    isValidEmail,
    isValidRole,
    authorizeRoles,
    comprobarToken
}