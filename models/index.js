import Propiedad from './Propiedad.js'
import Categoria from './Categoria.js'
import Precio from './Precio.js'


Propiedad.belongsTo(Precio,{foreignKey: 'precioId'})
Propiedad.belongsTo(Categoria,{foreignKey: 'categoriaId'})

export{
    Propiedad,
    Categoria,
    Precio,
}