const { response } = require("express");
const Pedidos = require("../models/Pedido");
const { Usuarios } = require("../models");

const createOrder = async(req,res= response) =>{
    const order = req.body
    const {id} = req.usuario
    order.usuarioId = id
 
    try {
 
        await Pedidos.create(order)
        res.json({
          msg:'Pedido creado con exito'
        })
    } catch (error) {
 
      res.json({
        msg:'Error al crear el pedido',
        error
      })
    }
}
const getOrder = async(req,res= response) =>{
    const {id} = req.params
    try {
        const order = await Pedidos.findByPk(id);
        res.json(order);
      } catch(err) {
        
        res.status(500).json({ msg: "Error al obtener pedido" });
      }

}
const getUserOrder = async(req,res=response)=>{
    const {id} = req.params
    try {
      const usuario = await Usuarios.findOne({
        where:{
          id:id
        },
        include:[
          {
            model:Pedidos,
          }
        ]
      });
      res.json(usuario)
    } catch (error) {
      
      res.json({
        msg:"No se pudo obtener las ordenes del usuario seleccionado"
      })
    }
}
const getOrders = async(req,res= response) =>{

    const {id} = req.usuario
    try {
        const orders = await Pedidos.findAll({where:{usuarioId:id}});
        res.json(orders);
      } catch(err) {
        
        res.status(500).json({ msg: "Error al obtener pedidos" });
      }
}
 
const deleteOrder = async(req,res= response) =>{
    try {
        const order = await Pedidos.findByPk(req.params.id)
    
        const {id} = order
        await order.destroy()
        res.json({
          msg:`El pedido nro ${id} ha sido eliminado con exito`
        })
        
      } catch (error) {
        res.status(400).json({
          msg:`Se produjo un error al intentar eliminar el pedido nro ${id} ha sido eliminado con exito`
        })
        
      }
}

module.exports = {
    createOrder,
    getOrder,
    getOrders,
    deleteOrder,
    getUserOrder
}