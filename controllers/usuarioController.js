import { request } from 'express'
import {check, validationResult} from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import{generarId}from '../helpers/tokens.js';
import{emailRegistro, emailOLvidePassword}from '../helpers/emails.js';
import { UUID } from 'sequelize';

const formularioLogin = (req, res) => {
    res.render('auth/login',{
        pagina: 'Iniciar sesion'
    })  
}

const autenticar = async (req, res) => {
   
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req)

    let resultado=validationResult(req)

    if(!resultado.isEmpty()){
    
        return res.render('auth/login',{
            pagina: 'Iniciar sesion',
            errores: resultado.array()
        })  
    }

 
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


//funcion que comprueba una cuenta
const confirmar = async (req, res) => {
const {token}= req.params;
 //verificar token
const usuario = await Usuario.findOne({where:{token}})

if (!usuario) {
  return res.render('auth/confirmar-cuenta',{
    pagina: 'Error al cofirmar cuenta',
    mensaje: 'Hubo un error al confirmar tu cuenta',
    error: true
})

}
 //confirmar cuenta
usuario.token=null;
usuario.confirmado =true;
await usuario.save();

res.render('auth/confirmar-cuenta',{
    pagina: 'Cuenta Confirmada',
    mensaje: 'La cuenta se confirmo correctamente'
})

}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password',{
        pagina: 'Recupera tu acceso a bienes raices'
    })  
}

const resetPassword =async (req, res) => {

//validacion
await check('email').isEmail().withMessage('Eso no parece un email').run(req)

let resultado=validationResult(req)

//verficar que el resultado sea vacio
//return res.json(resultado.array());
if(!resultado.isEmpty()){
    //errores

    return res.render('auth/olvide-password',{
        pagina: 'Recupera tu acceso a bienes raices',
        errores: resultado.array()

    })

}

//buscar usuario
const {email} = req.body

const usuario = await Usuario.findOne({where:{email}})
if(!usuario){
    return res.render('auth/olvide-password',{
        pagina: 'Recupera tu acceso a bienes raices',
        errores: [{msg:'El email no pertenece a ningun usuario'}]

    })

}

//generar token y enviar email
usuario.token = generarId();
await usuario.save();

//email
emailOLvidePassword({

email: usuario.email,
nombre: usuario.nombre,
token: usuario.token,


})

//mensaje
res.render('templates/mensaje',{
    pagina: 'restablece password',
    mensaje: 'Hemos enviado un Email con las instrucciones'
})
}

const comprobarToken = async (req, res) => {
const{token} =req.params;
const usuario= await Usuario.findOne({where:{token }})

if(!usuario){
    return res.render('auth/confirmar-cuenta',{
        pagina: 'Restablece tu password',
        mensaje: 'Hubo un error al validar tu informacion, intenta de nuevo',
        error: true
    })

}


//usuario valido
res.render('auth/reset-password', {
    pagina: 'Restablece tu password'
})
}

const nuevoPassword = async(req, res) => {
    //validar el password
    await check('password').isLength({min: 6}).withMessage('El password debe de ser de al menos 6 caracteres').run(req)
 

    let resultado=validationResult(req)


if(!resultado.isEmpty()){
    //errores

    return res.render('auth/reset-password',{
        pagina: 'restablece tu password',
        errores: resultado.array()
    })  
}

const{token} =req.params;
const{password} =req.body;

    //identificar
 const usuario = await Usuario.findOne({where: {token}})   
    //hash
    const salt= await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token=null;
    await usuario.save();

    return res.render('auth/confirmar-cuenta',{
        pagina: 'password restablecido',
        mensaje: 'El password se restablecio correctamente'
    }) 
}

export{
    formularioLogin,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    autenticar
}