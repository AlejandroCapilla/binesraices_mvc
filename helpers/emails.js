import e from 'express';
import nodemailer from 'nodemailer'

const emailRegistro = async(datos) =>{

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port:  process.env.EMAIL_PORT,
        auth: {
          user:  process.env.EMAIL_USER,
          pass:  process.env.EMAIL_PASS
        }
      });


      const {email,nombre,token}= datos

      await transport.sendMail({

        from:'BienesRaices.com',
        to:email,
        subject:'Confirma tu cuenta en BienesRaices.com',
        subject: 'Confirma tu cuenta en BienesRaices.com',
        html:`
        <p>Hola ${nombre},comprueba tu cuenta en bienes raices</p>
        <p>Confirma tu cuenta en el siguiente enlace:
        <a href="">Confirmar cuenta</a></p>

        <p>Si no creaste esta cuenta no le hagas caso a este mensaje
        `
      })
}

export{

    emailRegistro

}

