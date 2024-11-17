import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios';
import Env from '@ioc:Adonis/Core/Env';

export default class Security {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    let theRequest = request.toJSON()
    console.log(theRequest);
    if (theRequest.headers && theRequest.headers.authorization) {
    let token = theRequest.headers.authorization.replace("Bearer ", "")
    let thePermission: object = {
      url: theRequest.url,
      method: theRequest.method
    }
    try {
      const result = await axios.post(`${Env.get('proyecto-prog-3')}/api/public/security/permissions-validation`, thePermission, //pide permiso si puede ingresar o no a ms-segiridad, es por eso que inyectamos el endpoint en ms-seguridad (le pide el de "negocio" a seguridad si puede ingresar a las peliculas)
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log("La respuesta de ms-security >" + result.data + "<")
      if (result.data == true) {
        console.log(result.data)
        await next()
      } else {
        console.log("no puede ingresar")
        return response.status(401)
      }
    } catch (error) {
      console.error(error)
      return response.status(401)
    }
    //---------------------------
    }else{
      return response.status(401)
    }
    //---------------------------
  } 

}

