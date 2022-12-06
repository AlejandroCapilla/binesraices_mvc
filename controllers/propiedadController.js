import { unlink } from 'node:fs/promises';
import {validationResult} from 'express-validator';
import {Precio, Categoria, Propiedad} from "../models/index.js";
const admin = async(req, res) => {

//leer querystring

const{pagina:paginaActual} = req.query

const expresion = /^[1-9]$/

if(!expresion.test(paginaActual)){

    return res.redirect('/mis-propiedades?pagina=1')

}

try {
    //limites y offset
    const limit=5
    const offset=((paginaActual*limit)-limit)

const [propiedades, total] = await Promise.all([

    Propiedad.findAll({
        limit,
        offset,
        include: [
            {model:Categoria, as:'categoria'},
            {model:Precio, as:'precio'}
        ]
        
        }),

        Propiedad.count()

])
console.log(total);
        res.render('propiedades/admin', {
            pagina: 'Mis propiedades',
            propiedades,
            paginas:Math.ceil(total/limit),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limit
        })
         
} catch (error) {
   console.log(error); 
}

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

const editar = async (req,res) =>{

    const{id} =req.params

    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    

    //consultar precio y categoria
    const[categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
        ])
    
        res.render('propiedades/editar', {
            pagina: 'Editar propiedad',
            categorias,
            precios,
            datos:propiedad
        }) 

}

const guardarCambios = async (req,res) =>{
    
    //verificar validacion
    
        //validacion
        let resultado = validationResult(req)
        
        if (!resultado.isEmpty()) {
                //consultar precio y categoria
            const[categorias,precios] = await Promise.all([
                Categoria.findAll(),
                Precio.findAll()
                ])
                res.render('propiedades/editar', {
                    pagina: 'Editar propiedad',
                    categorias,
                    precios,
                    errores: resultado.array(),
                    datos:req.body
                }) 
        }

    const{id} =req.params

    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

try {
    const{titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, 
        precio:precioId, categoria:categoriaId} = req.body
        
propiedad.set({
titulo,
descripcion,
habitaciones,
estacionamiento,
wc,
calle,
lat,
lng,
precioId,
categoriaId
})

await propiedad.save()

res.redirect('/mis-propiedades')

} catch (error) {
  console.log(error); 
}
}

const eliminar = async (req,res) =>{

    const{id} =req.params

    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
}

await unlink(`public/uploads/${propiedad.imagen}`)

await propiedad.destroy()
res.redirect('/mis-propiedades')


}


const mostrarPropiedad = async (req,res) =>{
    const{id} =req.params

    const propiedad = await Propiedad.findByPk(id,{
        include: [
            {model:Categoria, as:'categoria'},
            {model:Precio, as:'precio'}
        ]
    
    })

    if (!propiedad) {
        return res.redirect('/404')
} 

res.render('propiedades/mostrar',{
propiedad,
pagina:propiedad.titulo

    
})
}

export{
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    mostrarPropiedad
}