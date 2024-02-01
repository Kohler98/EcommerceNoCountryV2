const path = require('path');
const Usuarios = require('../models/Usuario');
const fs = require('fs');
const { Productos } = require('../models');

 
const uploadImageProfile = async (req, res, next) => {
  try {
    const {id} = req.usuario
    const usuario = await Usuarios.findByPk(id)
    
    
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo'});
    }
    if(req.file){
      if(usuario.imagen){
          const filename = path.basename(usuario.imagen);
          const imagePath = path.join(__dirname, '..', 'public', 'uploads', 'users', filename);
          fs.unlink(imagePath, (err) => {
            if (err) {
 
              return;
            } 
 
          });
        }
        usuario.imagen = req.file.filename
        await usuario.save()
    }
 
      res.json({msg:'Imagen de perfil actualizada'});
    } catch(err) {
 
      res.status(500).send('Server Error');
    }
  };
const uploadImageProduct = async (req, res, next) => {
  try {
    const {id} = req.params
    const producto = await Productos.findByPk(id)
    
    
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo'});
    }
 
    if(req.file){
      if(producto.imagen){
          const filename = path.basename(producto.imagen);
          const imagePath = path.join(__dirname, '..', 'public', 'uploads', 'productos', filename);
          fs.unlink(imagePath, (err) => {
            if (err) {
 
              return;
            } 
 
          });
        }
        producto.imagen = req.file.filename
        await producto.save()
    }
 
      res.json({msg:'Imagen del producto actualizada'});
    } catch(err) {
 
      res.status(500).send('Server Error');
    }
  };
module.exports = {
 
  uploadImageProfile,
  uploadImageProduct
};