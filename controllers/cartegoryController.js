const { response } = require("express");
const Categorias = require("../models/Categoria");

const crearCategoria = async(req,res=response)=>{
    const {nombre} = req.body
    
    const categoria = await Categorias.findOne({where:{nombre:nombre.toLocaleLowerCase()}})
    if(categoria){
        return res.status(400).json({
            msg:'Ya existe una categoria con ese nombre'
        })
    }
    try {

        await Categorias.create(req.body)
 
         
        res.json({msg:"Categoria creada con exito"});
    } catch (error) {
        res.status(500).json({ msg: "Error al crear categoria" });
    }
}
const mostrarCategorias = async(req,res=response)=>{
    try {
        const categories = await Categorias.findAll();
        res.json(categories);
    } catch(err) {
        
        res.status(500).json({ msg: "Error al obtener categoria" });

    }
}
const editarCategoria = async(req,res=response)=>{
    const {id} = req.params
    const {nombre} = req.body
    const slug = nombre.replace(/\s/g, "-");
    const categoria = await Categorias.findByPk(id)
 
    if(!categoria){
        return res.status(400).json({
            msg:'La categoria que esta intentado edita no existe'
        })
    }

    try {
        await Categorias.update({nombre,slug},{where:{id:id}})
   
        res.json({
          msg:`La categoria ha sido actualizada con exito`
        })
      
    } catch (error) {
        res.status(400).json({
          msg:'Error al tratar de actualizar'
      })
    }
    
}
const eliminarCategoria = async(req,res=response)=>{
    const {id} = req.params
    try {
        const category = await Categorias.findByPk(id)
        const {nombre} = category
        await category.destroy()
        res.json({
          msg:`La categoria ${nombre} ha sido eliminada`
        })
        
      } catch (error) {
        res.status(400).json({
          msg:`Se produjo un error al intentar eliminar la categoria`
        })
        
      }
}
const mostrarCategoria = async(req,res=response)=>{
    const {id} = req.params
    try {
        const category = await Categorias.findOne({where:{id:id}});
        res.json(category);
    } catch(err) {
        
        res.status(500).json({ msg: "Error al obtener categoria" });
    }
}

module.exports ={
    mostrarCategorias,
    crearCategoria,
    editarCategoria,
    eliminarCategoria,
    mostrarCategoria
}