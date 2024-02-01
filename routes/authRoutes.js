const { Router } = require("express");
const { check } = require("express-validator");
const { isValidEmail, isValidRole, authorizeRoles, comprobarToken } = require("../helpers/dbValidators");
const { createUser, login, getAllUsers, deleteUser, updateUser, getUserById, getUserProfile, updateProfile, confirmarCuenta, forgotPassword, nuevoPassword, authPass } = require("../controllers/authController");
const { validarCampos } = require("../middleware/validarCampos");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { subirImagenProfile } = require("../handlers/subirArchivos");
const { uploadImageProfile } = require("../controllers/imageController");
const { getUserOrder } = require("../controllers/orderController");
 
const router = Router()

router.post('/signup',[
    check('nombre', "El campo nombre es obligatorio").not().isEmpty(),
    check('pais', "El campo pais no puede ir vacio").not().isEmpty(),
    check('estado', "El campo estado no puede ir vacio").not().isEmpty(),
    check('ciudad', "El campo ciudad no puede ir vacio").not().isEmpty(),
    check('password', "La contraseña no es valida y debe tener  mas de 6 letras").isLength({min:6}),
    check('email', "El correo no es valido").isEmail(),
    check('email').custom(isValidEmail),
    
    check('role').custom( isValidRole),
    validarCampos
  ], createUser)  
  
router.post('/signin',[
  check('email', "El correo no es valido").isEmail(),
  check('password', "El campo contraseña no puede ir vacio").not().isEmpty(),
  validarCampos
], login)  

router.get('/confirmar-cuenta/:id',confirmarCuenta)

router.post('/forgot-password',[
  check('email', "El correo no es valido").isEmail(),
  check('email').not().custom(isValidEmail),
  validarCampos
],forgotPassword)

router.post('/forgot-password/:token',[
  check('password', "La contraseña no es valida y debe tener  mas de 6 letras").isLength({min:6}),
  check('password', "El campo contraseña no puede ir vacio").not().isEmpty(),
  check('repetirPassword', "El campo repetir contraseña no puede ir vacio").not().isEmpty(),
  comprobarToken,
  validarCampos
],nuevoPassword)

router.route("/me").get(isAuthenticated, getUserProfile);
router.route("/me/update").put(isAuthenticated, updateProfile);

router.get('/admin/users',
isAuthenticated,
authorizeRoles("ADMIN_ROLE"),
getAllUsers)
 
router
  .route("/admin/user/:id")
  .get(isAuthenticated, authorizeRoles("ADMIN_ROLE"), getUserById)
  .put(isAuthenticated, authorizeRoles("ADMIN_ROLE"), updateUser)
  .delete(isAuthenticated, authorizeRoles("ADMIN_ROLE"), deleteUser);

router.get('/admin/order/:id',
isAuthenticated, 
authorizeRoles("ADMIN_ROLE"),
validarCampos,
getUserOrder)
// Rutas de Imagen de perfil
router.post('/users/me/profile-image', isAuthenticated, subirImagenProfile, uploadImageProfile);

module.exports = router