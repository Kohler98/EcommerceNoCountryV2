const Comentarios = require("../models/Comentario")
const Productos = require("../models/Producto")
const Reply = require("../models/Reply")

const agregarComentario = async(req,res)=>{
    // obtener el comentario
    const {comentario} = req.body
    
    try {
        await Comentarios.create({
            mensaje: comentario,
            usuarioId: req.usuario.id,
            productoId : req.params.id
        })
        return res.json({
            msg:"Comentario creado con exito"
        })
    } catch (error) {
        console.log(error)
        return res.json({
            msg:"Error al crear comentario"
        })
    }

}
const agregarReply = async(req,res, next)=>{
    // obtener el comentario
    const {comentario} = req.body
    const {id} = req.params
    const comment = await Comentarios.findByPk(id);
 
    if(req.usuario.role !="ADMIN_ROLE" && req.usuario.id != comment.usuarioId){
       return res.status(400).json({
            msg:"No tiene acceso a este recurso"
        })
    }
    try {
        await Reply.create({
            mensaje: comentario,
            usuarioId: req.usuario.id,
            comentarioId : req.params.id
        })
        return res.json({
            msg:"Reply creado con exito"
        })
    } catch (error) {
        console.log(error)
       return res.json({
            msg:"Error al crear comentario"
        })
    }

}

const eliminarReply = async(req,res,next)=>{
    const {id} = req.params
    try {
        const reply = await Reply.findByPk(id)
        if(!reply){
            res.status(404).json('Accion no valida')
            return next()
        }
        if(req.usuario.role !="ADMIN_ROLE" && req.usuario.id != reply.usuarioId){
            return res.status(400).json({
                 msg:"No tiene acceso a este recurso"
             })
         }
 
        await reply.destroy();
        res.status(200).json('Eliminado correctamente')
        return next()
 
    } catch (error) {
        res.status(200).json('Error al tratar de eliminar el reply')
        return next()
    }


}
const eliminarComentario = async(req,res, next)=>{
    // tomar el id del comentario
    const {id} = req.params

    // consultar el comentario
    try {
        const comentario = await Comentarios.findByPk(id)
            // verificar si existe el comentario
        if(req.usuario.role !="ADMIN_ROLE" && req.usuario.id != comentario.usuarioId){
            return res.status(400).json({
                    msg:"No tiene acceso a este recurso"
                })
            }
        if(!comentario){
            res.status(404).json('Accion no valida')
            return next()
        }

        //consultar el producto
        const producto = await Productos.findOne({where:{id:comentario.productoId}})
        if(!producto){
            res.status(404).json('Accion no valida')
            return next()
        }

        // verificar que quien lo borra sea el creador y que el comentario este asociado a al producto
        if(producto.id == comentario.productoId  ){
            await comentario.destroy();
            res.status(200).json('Eliminado correctamente')
            return next()
        }else{
            res.status(403).json('Error al eliminar comentario')
            return next()
        }
    } catch (error) {
        res.status(403).json('Error al tratar de eliminar el comentario')
        return next()
    }
}

module.exports = {
    agregarComentario,
    agregarReply,
    eliminarComentario,
    eliminarReply
}