const { Router } = require("express");
const { getInvoiceUser, getTotalInventary, createProductsByExcel, getAllResumeSells, getAllResumeSellsUser, getSelectedUserResume, getSelectedTotalResume } = require("../controllers/invoiceController");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { subirExcelProducto } = require("../handlers/subirArchivos");
const { validarCampos } = require("../middleware/validarCampos");
const { authorizeRoles } = require("../helpers/dbValidators");

const router = Router()

router.get('',[
    isAuthenticated,
    authorizeRoles("ADMIN_ROLE"),
    validarCampos,
],getTotalInventary)

router.get("/:id",[
    isAuthenticated
],getInvoiceUser);

router.get('/selected/total/month',[
    isAuthenticated,
    authorizeRoles("ADMIN_ROLE"),
    validarCampos,
],getSelectedTotalResume)


router.get('/selected/:id',[
    isAuthenticated,
    authorizeRoles("ADMIN_ROLE"),
    validarCampos,
],getSelectedUserResume)

router.get('/total/resume',[
    isAuthenticated,
    authorizeRoles("ADMIN_ROLE"),
    validarCampos,
],getAllResumeSells)

router.get('/total/:id',[
    isAuthenticated,
    authorizeRoles("ADMIN_ROLE"),
    validarCampos,
],getAllResumeSellsUser)

router.post('/crear',
    isAuthenticated,
    authorizeRoles("ADMIN_ROLE"),
    subirExcelProducto,
    validarCampos,
createProductsByExcel)

module.exports = router