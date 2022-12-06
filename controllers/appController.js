import { Sequelize } from "sequelize";
import {Precio,Categoria,Propiedad} from '../models/index.js';

const inicio = async(req, res) => {

const[categorias,precios, casas, departamentos] = await Promise.all([

Categoria.findAll({raw: true}),
Precio.findAll({raw: true}),
Propiedad.findAll({
    limit: 3,
    where:{
        categoriaId: 1
    },
    include:[
        {
            model:Precio,
            as: 'precio'
        }
    ],
    order: [
        ['createdAt', 'DESC']
    ]
}),
Propiedad.findAll({
    limit: 3,
    where:{
        categoriaId: 2
    },
    include:[
        {
            model:Precio,
            as: 'precio'
        }
    ],
    order: [
        ['createdAt', 'DESC']
    ]
})

])

res.render('inicio', {
pagina:"INICIO",
categorias,
precios,
casas,
departamentos

})

}

const categoria = async(req, res) => {

const {id} = req.params

//comprobar que la categoria exista
const categoria = await Categoria.findByPk(id)

if(!categoria){

    return res.redirect('/404')

}

//obtener propiedades
const propiedades = await Propiedad.findAll({
    where: {
        categoriaId: id
    },
    include:[{
        model: Precio,as: 'precio'
    }]

})

res.render('categoria',{
pagina: `${categoria.nombre} en Venta`,
propiedades
})

}
const noEncontrado = async(req, res) => {

res.render('404',{

pagina: 'No encontrado Error 404'

})

}

const buscador = async(req, res) => {

const{ termino } = req.body

//validar qu etermino no esta vacio
if(!termino.trim()){

    return res.redirect('back')

}

    //consultar
    const propiedades = await Propiedad.findAll({
        where: {

            titulo:{
                [Sequelize.Op.like]: '%' + termino + '%'
            },


        },
        include:[{
            model: Precio,as: 'precio'
        }]
    })

    res.render('busqueda',{

        pagina:'Resultado de la busqueda',
        propiedades

    })

    
}
export{
    inicio,
    categoria,
    noEncontrado,
    buscador
}