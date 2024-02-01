const multer = require('multer');
const path = require('path');
 
const shortid = require('shortid')


const configuracionMulterPerfil = {
  limits : {filesize : 10000},
  storage:fileStorage = multer.diskStorage({
      destination:(req,file,next)=>{
          next(null,__dirname+'/../public/uploads/users/')
      },
      filename : (req,file,next) =>{
          const extension = file.mimetype.split('/')[1]
          next(null,`${shortid.generate()}.${extension}`)
      }
  }),
  fileFilter(req,file,next){
      if(file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg"){
          //formato valido
          next(null , true)
      }else{
          //formato invalido

          next(new Error('Formato no valido'), false)
      }
  }
}
 
const uploadProfile = multer(configuracionMulterPerfil).single('imagen');

const subirImagenProfile = (req,res,next)=>{
  uploadProfile(req,res,function(error){
        if(error){
            res.json({msg:error})
        }
        return next()
    })
}

const configuracionMulterProductos = {
  limits : {filesize : 10000},
  storage:fileStorage = multer.diskStorage({
      destination:(req,file,next)=>{
          next(null,__dirname+'/../public/uploads/productos/')
      },
      filename : (req,file,next) =>{
          const extension = file.mimetype.split('/')[1]
          next(null,`${shortid.generate()}.${extension}`)
      }
  }),
  fileFilter(req,file,next){
      if(file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg"){
          //formato valido
          next(null , true)
      }else{
          //formato invalido

          next(new Error('Formato no valido'), false)
      }
  }
}

const uploadProducto = multer(configuracionMulterProductos).single('imagen')

//subir archivo

const subirImagenProducto = (req,res,next)=>{
  uploadProducto(req,res,function(error){
      if(error){
          
          res.json({msg:error})
      }
      return next()
  })
}

const configuracionMulterExcels = {
  limits : {filesize : 10000},
  storage:fileStorage = multer.diskStorage({
      destination:(req,file,next)=>{
          next(null,__dirname+'/../public/uploads/excels/')
      },
      filename : (req,file,next) =>{
          const extension = file.mimetype.split('/')[1]
          next(null,`${shortid.generate()}.${extension}`)
      }
  }),
  fileFilter(req,file,next){
 
    if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      // Formato válido (xlsx)
      next(null, true);
    } else {
      // Formato inválido
      next(new Error("Formato no válido"), false);
    }
  }
}

const uploadExcel = multer(configuracionMulterExcels).single('excel')
const subirExcelProducto = (req,res,next)=>{
  uploadExcel(req,res,function(error){
      if(error){
          
          res.json({msg:error})
      }
      return next()
  })
}
module.exports = {
    subirImagenProfile,
    subirImagenProducto,
    subirExcelProducto
};