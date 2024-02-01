const { response } = require("express")
const { Op } = require("sequelize");
const Productos = require("../models/Producto");
const Usuarios = require("../models/Usuario");

const busquedaProducto = async(req,res=response)=>{
    const { search } = req.body;
    
    try {
      const products = await Productos.findAll({
        where: {
          [Op.or]: [
            { titulo: { [Op.iLike]: `%${search}%` } },
            { category: { [Op.iLike]: `%${search}%` } }
          ]
        }
      });
  
      res.json(products);
    } catch (error) {
 
      res.status(500).json({ message: 'Internal server error' });
    }
}
const busquedaUsuario = async(req, res=response)=>{
      const {search} = req.body
 
      try {
        const usuarios = await Usuarios.findAll({
          where: {
            [Op.or]: [
              { nombre: { [Op.iLike]: `%${search}%` } },
              { apellido: { [Op.iLike]: `%${search}%` } },
              { role: { [Op.iLike]: `%${search}%` } }
            ]
          }
        });
    
        res.json(usuarios);
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
}
module.exports = {
    busquedaProducto,
    busquedaUsuario
}