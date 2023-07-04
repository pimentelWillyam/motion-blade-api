import { type Request, type Response } from 'express'

import type IAuthController from '../interface/IAuthController'
import type IAuthService from '../interface/IAuthService'
import type IUserRepository from '../interface/IUserRepository'
import type ICrypto from '../interface/ICrypto'
import type ITokenManager from '../interface/ITokenManager'

enum AuthError {
  AUTH_INVALID_REQUEST = 'A requisição inserida foi considerada inválida',
  AUTH_LIST_ERROR = 'Houve um erro quando tentamos buscar a lista',
  AUTH_NOT_FOUND = 'Não foi possível encontrar este usuário',
  AUTH_NOT_UPDATED = 'Não foi possível atualizar este usuário',
  AUTH_NOT_DELETED = 'Não foi possível deletar este usuário',
}
class AuthController implements IAuthController {
  constructor (readonly authService: IAuthService, readonly userRepository: IUserRepository, readonly crypto: ICrypto, readonly tokenManager: ITokenManager) {}

  async authenticate (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const authentication = await this.authService.authenticate(req.body.login, req.body.password)
      if (authentication != null) {
        return res.status(200).send(authentication)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(AuthError.AUTH_INVALID_REQUEST)
  }

  async validate (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    if (req.headers.authorization !== undefined && this.authService.validate(req.headers.authorization)) {
      return res.status(200).send('Token is valid')
    } else {
      return res.status(400).send('Invalid token')
    }
  }
}

export default AuthController
