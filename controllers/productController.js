const { response } = require("express")
const Productos = require("../models/Producto")
const path = require('path');
const fs = require('fs')
const Categorias = require("../models/Categoria");
const Comentarios = require("../models/Comentario");
const Usuarios = require("../models/Usuario");
const Reply = require("../models/Reply");


const crearProducto = async(req,res=response)=>{
    const producto = req.body

 
    if(req.file){
        producto.imagen = req.file.filename
    }
 
    try {
        await Productos.create(producto)
        res.json({msg:'producto creado con exito'})
    } catch (error) {
 
        res.json({msg:'Error al crear el producto'})
        
    }
}
const mostrarProductos = async(req,res=response)=>{
    try {
        const productos = await Productos.findAll();
        res.json(productos);
    } catch(err) {
        
        res.status(500).json({ msg: "Error al obtener los productos" });
    }
}
const filtrarProducto = async(req,res=response)=>{
    const {slug} = req.params
 

    const categoria = await Categorias.findOne({where:{slug:slug}})

    if(!categoria){
        return res.status(500).json({ msg: "Error la categoria que intenta obtener no existe" });
    }
   
    try {
        const productos = await Productos.findAll({where:{category:categoria.nombre}})
        res.json(productos)
    } catch (error) {
        return res.status(500).json({ msg: "Error productos no encontrados" });
        
    }
 
}
const editarProducto = async(req,res=response)=>{
    const {id} = req.params
    const newProducto = req.body
    const producto = await Productos.findByPk(id)
 
    
 
    if( req.file){

        const filename = path.basename(producto.imagen);
        const imagePath = path.join(__dirname, '..', 'public', 'uploads', 'productos', filename);
        fs.unlink(imagePath, (err) => {
          if (err) {
             
            return;
          } 
 
        });
        newProducto.imagen = req.file.filename
    }else{
        newProducto.imagen = producto.imagen
    }
 
    try {
        await Productos.update(newProducto,{where:{id:id}})
        
        res.json({
          msg:`Producto actualizados con exito`
        })
    } catch (error) {
        res.status(400).json({
            msg:'Error al tratar de actualizar'
        })
    }

}
const mostrarProducto = async(req,res=response)=>{
    const {id} = req.params
    try {
        const producto = await Productos.findOne({
            where:{
                id:id
            },
            include:[
                {
                    model:Comentarios,
                    attributes:['id','mensaje'],
                    include:[
                        {
                            model: Usuarios,
                            attributes: ['id', 'nombre','apellido', 'imagen']
                        },{
                            model: Reply,
                            attributes: ['id', 'mensaje'],
                            include: [
                              {
                                model: Usuarios,
                                attributes: ['id', 'nombre','apellido', 'imagen']
                              }
                            ]
                        }
                    ]
                }
            ],
           
        });
    

        res.json({producto});
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: "Error al obtener el producto" });
    }
}
const eliminarProducto = async(req,res=response)=>{
    const {id} = req.params
    const producto = await Productos.findByPk(id);
    if(!producto){
        return res.status(400).json({
            msg:`El producto que intenta eliminar no existe`
          })
    }
    const {titulo} = producto
    if(producto.imagen){
        const imagenAnterioPath = __dirname + `/../public/uploads/productos/${producto.imagen}`
        // eliminar archivos con filesystem
        
        fs.unlink(imagenAnterioPath,(error)=>{
            if(error){
 
            }
            return
        })
    }
    try {

        await producto.destroy()
        res.json({
          msg:`El producto ${titulo} ha sido eliminada`
        })
        
      } catch (error) {
        res.status(400).json({
          msg:`Se produjo un error al intentar eliminar el producto`
        })
        
      }
}

module.exports = {
    crearProducto,
    mostrarProductos,
    filtrarProducto,
    editarProducto,
    mostrarProducto,
    eliminarProducto,
 
 
}