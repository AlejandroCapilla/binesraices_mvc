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
        text: 'Confirma tu cuenta en BienesRaices.com',
        html:`
        <p>Hola ${nombre},comprueba tu cuenta en bienes raices</p>
        <p>Confirma tu cuenta en el siguiente enlace:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">
        Confirmar cuenta</a></p>
        <p>Si no creaste esta cuenta no le hagas caso a este mensaje</p>
        `
      })
}

const emailOLvidePassword = async(datos) =>{

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
      subject:'recupera tu cuenta en BienesRaices.com',
      text: 'recupera tu contrasena en BienesRaices.com',
      html:`
      <p>Hola ${nombre},has solicitado restablecer tu password en bienesraices.com</p>
      <p>sigue el siguiente enlace para cambiar tu password:
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">
      Restablecer</a></p>

      <p>Si no solicitaste cambio de password no le hagas caso a este mensaje</p>
      `
    })
}

export{

    emailRegistro,
    emailOLvidePassword

}

