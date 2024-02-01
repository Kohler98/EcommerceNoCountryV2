const { Router } = require("express");
const { agregarComentario, agregarReply, eliminarComentario, eliminarReply } = require("../controllers/commentController");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { validarCampos } = require("../middleware/validarCampos");
const router = Router()

router.post('/:id',[
    isAuthenticated,
    validarCampos
],agregarComentario)

router.delete('/:id',[
    isAuthenticated,
    validarCampos
],eliminarComentario)

router.post('/reply/:id',[
    isAuthenticated,
    validarCampos,
  ],agregarReply)

router.delete('/reply/:id',[
    isAuthenticated,
    validarCampos,
  ],eliminarReply)

module.exports = router