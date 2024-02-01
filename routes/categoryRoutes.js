const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middleware/validarCampos");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { crearCategoria, mostrarCategoria, mostrarCategorias, editarCategoria, eliminarCategoria } = require("../controllers/cartegoryController");
const { authorizeRoles } = require("../helpers/dbValidators");
const router = Router()

router.post('/crear',
isAuthenticated,
authorizeRoles("ADMIN_ROLE"),
validarCampos,
crearCategoria)

router.get('/',
mostrarCategorias)

router.get('/:id',
mostrarCategoria)

router.put('/:id',
isAuthenticated,
authorizeRoles("ADMIN_ROLE"),
validarCampos,
editarCategoria)

router.delete('/:id',
isAuthenticated,
authorizeRoles("ADMIN_ROLE"),
validarCampos,
eliminarCategoria)

module.exports = router