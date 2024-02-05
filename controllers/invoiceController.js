const { response } = require("express");
const Pedidos = require("../models/Pedido");
const { generarFactura, generarExcel, readExcelFile, formatearPedido } = require("../handlers/generarArchivos");
const fs = require('fs');
const { Productos, Usuarios } = require("../models");
const { meses } = require("../config/meses");
const getInvoiceUser =async (req,res=response) =>{

    const {id } = req.params

    const pedido = await Pedidos.findByPk(id)
    if(req.usuario.role !="ADMIN_ROLE" && req.usuario.id != pedido.usuarioId){
        res.status(400).json({
            msg:"No tiene acceso a este recurso"
        })
    }
  
    const filename = `Factura${Date.now()}.pdf`

    const stream = res.writeHead(200,{
        'Content-Type':'application/pdf',
        'Content-disposition':`attachment:filename=${filename}`
    })
    generarFactura(pedido, stream)
    
}

const getTotalInventary = async (req,res=response)=>{
    try {
        
        const productos = await Productos.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt', 'imagen','descuento','activo'] }
          });
        const nuevosProductos = productos.map(producto => producto.dataValues)
 
        generarExcel(nuevosProductos,res, "total_inventario")
 
 
    } catch (error) {
        res.json({
            msg:"No hay inventario"
        })
    }


}

const createProductsByExcel = async (req,res=response) =>{
 
    try {
        // Obtener los registros existentes en la base de datos
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ningún archivo'});
          }
 
        const excel = __dirname + `/../public/uploads/excels/${req.file.filename}`
        
  

   
        const pruductosExcel = readExcelFile(excel)
        if(!pruductosExcel){
            return res.status(400).json({ error: 'No se pudo leer el archivo excel'});
        }
        const productsDB = await Productos.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt', 'imagen','descuento','activo'] }
        });
        const productosDB = productsDB.map(producto=>producto.dataValues)
 
 
        const productos = pruductosExcel.map(producto =>{
            return{
                id:producto.id,
                titulo:producto.titulo,
                precio:Number(producto.precio),
                category:producto.category,
                in_stock:Number(producto.in_stock),
                marca: producto.marca,
                envio: producto.envio.toLowerCase() == "true" ? true: false,
                porcentaje: Number(producto.porcentaje),
                descripcion: producto.descripcion,
            }
        })

        // Filtrar los registros a actualizar
        const productosActualizar = productos.filter(producto => productosDB.some(p => p.id==producto.id? JSON.stringify(p) != JSON.stringify(producto)  : ''))
        const productosCrear= productos.filter(producto => !producto.id).map(producto=>{
            return{
                titulo:producto.titulo,
                precio:Number(producto.precio),
                category:producto.category,
                in_stock:Number(producto.in_stock),
                marca: producto.marca,
                envio: producto.envio == "true" ? Boolean(producto.envio): !producto.envio,
                porcentaje: Number(producto.porcentaje),
                descripcion: producto.descripcion,
            }
        })

 
        // Insertar los registros nuevos si existen

        if (productosCrear.length > 0) {
            await Productos.bulkCreate(productosCrear);
        }
        // Actualizar los registros existentes si existen
        if (productosActualizar.length > 0) {
            await Promise.all(productosActualizar.map(async producto => {
                await Productos.update(producto, { where: { id: producto.id } });
            }));
        }
        fs.unlink(excel, (err) => {
            if (err) {
 
              return;
            } 
 
          });
        res.json({msg:"Se han realizado los cambios con exito"})
    } catch (error) {
 
        res.json({msg:"Hubo un error"})
    }
 
}

const getAllResumeSells = async(req,res = response)=>{
    try {
        const {mes} = req.body
        const usuarios = await Usuarios.findAll({
            order: [['nombre', 'ASC']],

            attributes: ['nombre', 'apellido', 'email'] ,
            include:[
                {
                    model: Pedidos,
                    attributes: ['nombre','apellido', 'pais','estado','ciudad','postal_code','phone','productos','createdAt']
                }
            ]
        })
        
        const nuevosUsuarios = usuarios.flatMap(usuario =>{
            return formatearPedido(usuario)
        })
        const resultadosFiltrados = nuevosUsuarios.filter(usuario => usuario.mes === mes);

        
        if(resultadosFiltrados.length > 0 || meses.indexOf(mes) !== -1){
            if(resultadosFiltrados.length == 0){
                return res.json({msg:`No se realizaron pedidos en ${mes}`})
            }
            //  Descargando pedidos para el mes ${mes} 
            // res.json(resultadosFiltrados)
            return generarExcel(resultadosFiltrados,res, `pedidos_totales_${mes}`)
            
        }else{
            // res.json(nuevosUsuarios)
            return generarExcel(nuevosUsuarios,res, "pedidos_totales")
   
        }

 
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg:"error al generar excel"
        })
    }
}
const getAllResumeSellsUser = async(req,res = response)=>{
    try {
        const {id} = req.params
        const {mes} = req.body
 
        const usuario = await Usuarios.findOne({
            order: [['nombre', 'ASC']],
            where:{id:id},
            attributes: ['nombre', 'apellido', 'email'] ,
            include:[
                {
                    model: Pedidos,
                    attributes: ['nombre','apellido', 'pais','estado','ciudad','postal_code','phone','productos','createdAt']
                }
            ]
        })

        const nuevosUsuarios = formatearPedido(usuario)
        const resultadosFiltrados = nuevosUsuarios.filter(usuario => usuario.mes === mes);
        
        if(resultadosFiltrados.length > 0 || meses.indexOf(mes) !== -1){
            if(resultadosFiltrados.length == 0){
                return res.json({msg:`No se realizaron pedidos en ${mes}`})
            }
            //  Descargando pedidos de el mes ${mes} para el usuario ${usuario.nombre} 
            return generarExcel(resultadosFiltrados,res, `${usuario.nombre}_${mes}`)
            // res.json(resultadosFiltrados)
            
        }else{
            // descargando pedidos para el usuario ${usuario.nombre} 
            return generarExcel(nuevosUsuarios,res, `${usuario.nombre}_pedidos`)
            // res.json(nuevosUsuarios)
        }
 
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg:"error al generar excel"
        })
    }
}

const getSelectedTotalResume = async(req,res= response)=>{

    try {
        const usuarios = await Usuarios.findAll({
            order: [['nombre', 'ASC']],

            attributes: ['nombre', 'apellido', 'email'] ,
            include:[
                {
                    model: Pedidos,
                    attributes: ['nombre','apellido', 'pais','estado','ciudad','postal_code','phone','productos','createdAt']
                }
            ]
        })
         
        const nuevosUsuarios = usuarios.flatMap(usuario =>{
            return formatearPedido(usuario)
        })
        
        const mesesFiltrados = meses.filter(mes => nuevosUsuarios.some(  usuario=> mes==usuario.mes));

        res.json(mesesFiltrados)

    } catch (error) {
        console.log(error)
    }
}
const getSelectedUserResume = async(req,res= response)=>{
    try {
        const {id} = req.params
 
 
        const usuario = await Usuarios.findOne({
            order: [['nombre', 'ASC']],
            where:{id:id},
            attributes: ['nombre', 'apellido', 'email'] ,
            include:[
                {
                    model: Pedidos,
                    attributes: ['nombre','apellido', 'pais','estado','ciudad','postal_code','phone','productos','createdAt']
                }
            ]
        })
        const nuevosUsuario = formatearPedido(usuario)
        const mesesFiltrados = meses.filter(mes => nuevosUsuario.some(  usuario=> mes==usuario.mes));

        res.json(mesesFiltrados)
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    getInvoiceUser,
    getTotalInventary,
    createProductsByExcel,
    getAllResumeSells,
    getAllResumeSellsUser,
    getSelectedTotalResume,
    getSelectedUserResume
}



