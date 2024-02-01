 
const { generarJWT, generarId } = require("../helpers/generarJWT");
const Pedidos = require("../models/Pedido");
const Usuarios = require("../models/Usuario");
const bcrypt = require('bcrypt');
const { emailSignup, emailForgotPass } = require("../handlers/sendEmail");
const { response } = require("express");

require('dotenv').config()

const createUser = async(req, res = response) => {
    const usuario = req.body
    try {
      
        const user = await Usuarios.create(usuario)
        //url de confirmacion
        const url = `${req.headers.referer}confirmar-cuenta/${user.id}`;

        // enviar email de confirmacion
        await emailSignup({
            usuario,
            url,
            subject : 'Confirma tu cuenta de TechZone',
            archivo : 'confirmar-cuenta'
        })
        res.json({
          msg:'Hemos enviado un correo de confirmacion a su direccion email'
        })
    } catch (error) {
      console.log(error)
    }
 
}
const login = async(req,res,next)=>{
  const {email, password} = req.body
  const usuario = await Usuarios.findOne({where:{email:email}})

  if(!usuario){
    return res.status(400).json({
        msg:'Ese usuario no existe'
    })
  }
  if(!usuario.activo){
    return res.status(400).json({
      msg:'La cuenta a la que intenta acceder aun no ha sido confirmada'
  })
  }
  
  if(!usuario.validPassword(password)){
    // si el password es incorrecto
    return res.status(400).json({
        msg:'Contraseña incorrecta'
    })
 
}

    const token = await generarJWT({id:usuario.id, createdAt:usuario.createdAt,updatedAt:usuario.updatedAt})
    res.json({token})
  }
const getAllUsers = async(req, res) =>{
    try {
      const usuarios = await Usuarios.findAll();
      res.json(usuarios);
    } catch(err) {
 
      res.status(500).json({ msg: "Error al obtener usuarios" });
    }
}

const getUserById = async(req,res)=>{
  const id = req.params.id;
  try {
    const usuario = await Usuarios.findByPk(id);
    if(usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ msg: "Usuario no encontrado" });
    }
  } catch(err) {
 
    res.status(500).json({ msg: "Error al obtener usuario" })
  }
}

const updateUser = async(req,res)=>{
  const {id} = req.params
  const {_id,password, ...resto} = req.body

    if(password){
      const salt = bcrypt.genSaltSync()
      resto.password = bcrypt.hashSync(password, salt);

  }
  try {
      await Usuarios.update(resto,{where:{id:id}})
 
      res.json({
        msg:`Datos actualizados con exito`
      })
    
  } catch (error) {
      res.status(400).json({
        msg:'Error al tratar de actualizar'
    })
  }
  
  
}
const deleteUser = async(req,res)=>{
  try {
    const usuario = await Usuarios.findByPk(req.params.id)

    const {id, nombre, apellido } = usuario
    await usuario.destroy()
    res.json({
      msg:`El usuario ${nombre} ${apellido} con el id: ${id} ha sido eliminado con exito`
    })
    
  } catch (error) {
    res.status(400).json({
      msg:`Se produjo un error al intentar eliminar ha ${nombre} ${apellido}`
    })
    
  }

}
const getUserProfile = async(req,res)=>{
  const usuario = await Usuarios.findByPk(req.usuario.id)
  const pedidos = await Pedidos.findAll({where:{usuarioId:req.usuario.id}})
  res.json({
    usuario,
    pedidos
  })
}
 
const updateProfile = async(req,res, next)=>{
  const {password, role, ...resto} = req.body
  const {id} = req.usuario
  const usuario = await Usuarios.findOne({where:{email:resto.email}})
  
  if(usuario && req.usuario.email != resto.email){
    return res.status(400).json({
      msg:`Ya existe un usuario con el email ${resto.email}`
    })
 
  }
  if(password){
    const salt = bcrypt.genSaltSync()
    resto.password = bcrypt.hashSync(password, salt);
    
  }
  try {
     
    await Usuarios.update(resto,{where:{id:id}})
    
      res.json({
        msg:`Datos actualizados con exito`
      })
    
  } catch (error) {
 
      res.status(400).json({
        msg:'Error al tratar de actualizar'
    })
  }
}
const confirmarCuenta = async( req, res)=>{

  try {
    const {id} = req.params

    const usuario = await Usuarios.findOne({where:{id:id}})
    if(!usuario){
      return res.status(400).json({
        msg:"La cuenta que intenta confirma no es valida"
      })

    }
    if(usuario.activo){
      return res.status(400).json({
        msg:"La cuenta ya se ha confirmado previamente, intenta iniciar sesion :)"
      })
    }
    //confirmar la cuenta
    usuario.token = null
    usuario.activo = true
    await usuario.save()
    return res.status(200).json({
      msg:"La cuenta se ha confirmado, ya puedes iniciar sesion"
    })
    
  } catch (error) {
    return res.status(400).json({
      msg:"Error al confirmar la cuenta"
    })
  }
}

const forgotPassword = async(req,res=response)=>{
 

  try {
    const {email} = req.body
    const usuario = await Usuarios.findOne({where:{email:email}})

    usuario.token = generarId()
   
    const url = `${req.headers.referer}restore/${usuario.token}`;
    await usuario.save()

    //enviar email
    emailForgotPass({
        email,
        nombre:usuario.nombre,
        token:usuario.token,
        subject:'Reestablece tu contraseña en TechZone.com',
        url:url,
        archivo : 'recuperar-password'
    })
    return res.status(200).json({
      msg:"Se ha enviado un correo para que reestablezca su contraseña"
    })
  } catch (error) {
    console.log(error)
  }
}
const nuevoPassword = async(req, res = response)=>{
  //validando password
  try {
    const {token} = req.params
    const {password,repetirPassword} = req.body
    if (password !== repetirPassword) {
      return res.status(400).json({ 
        error: 'Las contraseñas no son iguales' 
      });
    }
    const usuario = await Usuarios.findOne({where:{token}})
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt)
    usuario.token = null
    await usuario.save()

    return res.status(200).json({
      msg:"La contraseña se ha reestablecido correctamente"
    })
  } catch (error) {
    return res.status(400).json({
      msg:"Error al reestablecer la contraseña"
    })
  }

}
 
module.exports = {
    createUser,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserProfile,
    updateProfile,
    confirmarCuenta,
    forgotPassword,
    nuevoPassword,
 
}