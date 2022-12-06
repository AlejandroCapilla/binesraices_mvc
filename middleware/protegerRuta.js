import jwt from 'jsonwebtoken'
const protegerRuta = async(req, res, next) =>{
//const {_token} =req.cookies
    //verificar token
   //console.log(req.cookies._token)
   // console.log('hola')
//const { _token }= req.cookies
//if (!_token) {
    //return res.redirect('/auth/login')
//}
    //comprobar token

    next();

}

export default protegerRuta