const nodemailer = require('nodemailer')
const {emailConfig} = require('../config/email.js')
const fs = require("fs")
const util = require("util")
const ejs = require("ejs")
require('dotenv').config()

let transport = nodemailer.createTransport({
    host:emailConfig.host,
    port:emailConfig.port,
    auth:{
        user:emailConfig.user,
        pass:emailConfig.pass
    }
})

const emailSignup = async(opciones) =>{
 
 
    // leer archivo para el email
    const archivo = __dirname+`/../views/emails/${opciones.archivo}.ejs`
    //compilarlo
    const compilado = ejs.compile(fs.readFileSync(archivo,'utf8'))
    // crear el html
    const html = compilado({url:opciones.url})
    //configurar las opciones del email
    const opcionesEmail = {
        from: 'TechZone <noreply@techzone.com>',
        to:opciones.usuario.email,
        subject:opciones.subject,
        html
    }
    
    //enviar email
    
    const sendEmail = util.promisify(transport.sendMail,transport)
    return sendEmail.call(transport,opcionesEmail)
}
const emailForgotPass = async(opciones)=>{
 

    // leer archivo para el email
    const archivo = __dirname+`/../views/emails/${opciones.archivo}.ejs`
    //compilarlo
    const compilado = ejs.compile(fs.readFileSync(archivo,'utf8'))
    // crear el html
    const html = compilado({opciones:opciones})
 
      const opcionesEmail = {
        from: 'TechZone <noreply@techzone.com>',
        to:opciones.email,
        subject:opciones.subject,
        html
    }
      //enviar email
      const sendEmail = util.promisify(transport.sendMail,transport)
      return sendEmail.call(transport,opcionesEmail)
 
    }
module.exports = {
    emailSignup,
    emailForgotPass
}