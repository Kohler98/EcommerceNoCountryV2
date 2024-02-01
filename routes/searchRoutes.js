const { Router } = require("express");
 
const { busquedaProducto, busquedaUsuario } = require("../controllers/busquedaController");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { authorizeRoles } = require("../helpers/dbValidators");
const { validarCampos } = require("../middleware/validarCampos");


const router = Router()

router.post('/',
busquedaProducto)

router.post('/user',
isAuthenticated,
authorizeRoles("ADMIN_ROLE"),
validarCampos,
busquedaUsuario)

module.exports = router