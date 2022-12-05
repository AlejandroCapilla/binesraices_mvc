import {validationResult} from 'express-validator';
import {Precio, Categoria, Propiedad} from "../models/index.js";
const admin = async(req, res) => {

const propiedades = await Propiedad.findAll()
    res.render('propiedades/admin', {
        pagina: 'Mis propiedades',
        propiedades,
    })
   
}

//Formulario nueva propiedad
const crear = async(req, res) => {
    //consultar precio y categoria
    const[categorias,precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
    ])

    res.render('propiedades/crear', {
        pagina: 'Crear propiedad',
        categorias,
        precios,
        datos:{}
    })   
}

const guardar = async(req, res) => {
//validacion
let resultado = validationResult(req)

if (!resultado.isEmpty()) {
        //consultar precio y categoria
    const[categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
        ])
    res.render('propiedades/crear', {
        pagina: 'Crear propiedad',
        categorias,
        precios,
        errores: resultado.array(),
        datos:req.body
    }) 
}

// crear un registro

const{titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, 
    precio:precioId, categoria:categoriaId} = req.body
    


try {
    
const propiedadGuardada = await Propiedad.create({
titulo,
descripcion,
habitaciones,
estacionamiento,
wc,
calle,
lat,
lng,
precioId,
categoriaId,
imagen:''
})

const {id} =propiedadGuardada

res.redirect(`/propiedades/agregar-imagen/${id}`)

} catch (error) {
    console.log(error)
}

}


const agregarImagen = async(req, res) => {

const{id}=req.params

//validar si existe

const propiedad = await Propiedad.findByPk(id)

if (!propiedad) {
    return res.redirect('/mis-propiedades')
}

//verificar si esta publicada
if (propiedad.publicado) {
    return res.redirect('/mis-propiedades')
}


 res.render('propiedades/agregar-imagen',{

    pagina:`Agregar Imagen: ${propiedad.titulo}`,
    propiedad

 })

}

const almacenarImagen = async (req,res,next) =>{

    const{id}=req.params

    //validar si existe
    
    const propiedad = await Propiedad.findByPk(id)
    
    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }
    
    //verificar si esta publicada
    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    try {
    //almacenar imagen y publicar propiedad
    propiedad.imagen = req.file.filename
    
    propiedad.publicado = 1

    await propiedad.save()

    next()

    } catch (error) {
    console.log(error);  
    }

}

export{
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen
}