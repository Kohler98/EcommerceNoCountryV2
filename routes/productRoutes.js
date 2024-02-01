const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middleware/validarCampos");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { crearProducto, mostrarProductos, mostrarProducto, filtrarProducto, editarProducto, eliminarProducto } = require("../controllers/productController");
const { authorizeRoles } = require("../helpers/dbValidators");
 
const { subirImagenProducto } = require("../handlers/subirArchivos");
const { uploadImageProduct } = require("../controllers/imageController");
const router = Router()

router.post('/crear',
isAuthenticated,
authorizeRoles("ADMIN_ROLE"),
subirImagenProducto,
validarCampos,
crearProducto)

router.get('/',
mostrarProductos)

router.get('/get/:slug',
filtrarProducto)

router.get('/:id',
mostrarProducto)


router.put('/:id',
isAuthenticated,
authorizeRoles("ADMIN_ROLE"),
subirImagenProducto,
validarCampos,
editarProducto)

router.delete('/:id',
isAuthenticated,
authorizeRoles("ADMIN_ROLE"),
validarCampos,
eliminarProducto)

//subir imagen producto
router.post('/img/:id',
isAuthenticated,
authorizeRoles("ADMIN_ROLE"),
subirImagenProducto,
validarCampos,
uploadImageProduct);

module.exports = router