import { request } from 'express'
import {check, validationResult} from 'express-validator'
import Usuario from '../models/Usuario.js'
import{generarId}from '../helpers/tokens.js';
import{emailRegistro}from '../helpers/emails.js';

const formularioLogin = (req, res) => {
    res.render('auth/login',{
        pagina: 'Iniciar sesion'
    })  
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro',{
        pagina: 'Crear Cuenta'
    })  
}

const registrar =  async (req,res) => {
//validacion
await check('nombre').notEmpty().withMessage('El Nombre no puede ir vacio').run(req)
await check('email').isEmail().withMessage('Eso no parece un email').run(req)
await check('password').isLength({min: 6}).withMessage('El password debe de ser de al menos 6 caracteres').run(req)
await check('repetir_password').equals(req.body.password).withMessage('Los passwords no son iguales').run(req)

let resultado=validationResult(req)

//verficar que el resultado sea vacio
//return res.json(resultado.array());
if(!resultado.isEmpty()){
    //errores

    return res.render('auth/registro',{
        pagina: 'Crear Cuenta',
        errores: resultado.array(),
        usuario: {
            nombre: req.body.nombre,
            email: req.body.email
        }
    })  
}
 

//verficar usuario duplicado
const {nombre, email, password}=req.body

const existeUsuario = await Usuario.findOne({ where: {email}})
if (existeUsuario) {
    return res.render('auth/registro',{
        pagina: 'Crear Cuenta',
        errores: [{msg: 'el usuario ya esta registrado'}],
        usuario: {
            nombre: req.body.nombre,
            email: req.body.email
        }
    })   
}


//almacenar el usuario
const usuario = await Usuario.create({
nombre,
email,
password,
token: generarId()
})

//envia email
emailRegistro({

nombre: usuario.nombre,
email: usuario.email,
token: usuario.token,   
})

//mensaje de confirmacion
res.render('templates/mensaje',{
    pagina: 'cuenta creada correctamente',
    mensaje: 'Hemos enviado un Email de confirmacion, presiona en el enlace'
})

}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password',{
        pagina: 'Recupera tu acceso a bienes raices'
    })  
}

export{
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
}