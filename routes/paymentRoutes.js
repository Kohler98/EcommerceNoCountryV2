const { Router } = require("express");
const { check } = require("express-validator");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { processPaymet, sendStripeApiKey } = require("../controllers/paymentStripeController");
const { validarCampos } = require("../middleware/validarCampos");
const router = Router();

router.post("/process",[
    isAuthenticated,
    validarCampos
],processPaymet);
router.get("/stripeapi",[
    isAuthenticated,
    validarCampos
],sendStripeApiKey);

module.exports = router;