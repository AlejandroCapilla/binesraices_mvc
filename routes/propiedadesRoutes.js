import express  from "express";
import {body} from 'express-validator';
import { admin, crear, guardar, agregarImagen, almacenarImagen,editar,guardarCambios,eliminar,mostrarPropiedad} from "../controllers/propiedadController.js";
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";

const router = express.Router()


router.get('/mis-propiedades', protegerRuta, admin)
router.get('/propiedades/crear', crear)
router.post('/propiedades/crear', 
body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
body('descripcion')
    .notEmpty().withMessage('La descripcion del anuncio es obligatorio')
    .isLength({max: 255}).withMessage('La descrpcion es muy larga'),
body('categoria').isNumeric().withMessage('Selecciona una categoria'),
body('precio').isNumeric().withMessage('Selecciona un rango de precios'),
body('habitaciones').isNumeric().withMessage('Selecciona el numero de habitaciones'),
body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de lugares en el estacionamiento'),
body('wc').isNumeric().withMessage('Selecciona el numero de wc'),
body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
guardar
)

router.get('/propiedades/agregar-imagen/:id', 
agregarImagen
)

router.post('/propiedades/agregar-imagen/:id',

    upload.single('imagen'),
    almacenarImagen

)

router.get('/propiedades/editar/:id',
        editar
)

router.post('/propiedades/editar/:id', 
body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
body('descripcion')
    .notEmpty().withMessage('La descripcion del anuncio es obligatorio')
    .isLength({max: 255}).withMessage('La descrpcion es muy larga'),
body('categoria').isNumeric().withMessage('Selecciona una categoria'),
body('precio').isNumeric().withMessage('Selecciona un rango de precios'),
body('habitaciones').isNumeric().withMessage('Selecciona el numero de habitaciones'),
body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de lugares en el estacionamiento'),
body('wc').isNumeric().withMessage('Selecciona el numero de wc'),
body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
guardarCambios
)

router.post('/propiedades/eliminar/:id',
eliminar
)

//area publica
router.get('/propiedad/:id',
mostrarPropiedad
)

//almacenar mensajes enviados
export default router 