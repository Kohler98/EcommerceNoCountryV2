const { Router } = require("express");
  
const { validarCampos } = require("../middleware/validarCampos");
const { isAuthenticated } = require("../middleware/isAuthenticated");
 
const { createOrder, getOrders, getOrder, deleteOrder } = require("../controllers/orderController");
const router = Router()

router.post('/crear',
isAuthenticated,
validarCampos,
createOrder)

router.get('/',
isAuthenticated,
validarCampos,
getOrders)

router.get('/:id',
isAuthenticated,
validarCampos,
getOrder)

 
router.delete('/:id',
isAuthenticated,
validarCampos,
deleteOrder)



module.exports = router;