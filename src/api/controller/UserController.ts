import { type Request, type Response } from 'express'

import type IUserController from '../interface/IUserController'
import type IUserService from '../interface/IUserService'
import type IUserValidator from '../interface/IUserValidator'

enum UserError {
  USER_INVALID_REQUEST = 'A requisição inserida foi considerada inválida',
  USER_LIST_ERROR = 'Houve um erro quando tentamos buscar a lista',
  USER_NOT_FOUND = 'Não foi possível encontrar este usuário',
  USER_NOT_UPDATED = 'Não foi possível atualizar este usuário',
  USER_NOT_DELETED = 'Não foi possível deletar este usuário',
}
class UserController implements IUserController {
  constructor (readonly userService: IUserService, readonly userValidator: IUserValidator) {}

  async create (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      if (await this.userValidator.isUserValid(req.body.login, req.body.password, req.body.email, req.body.type)) {
        const user = await this.userService.create(req.body.login, req.body.password, req.body.email, req.body.type)
        return res.status(200).json(user)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(UserError.USER_INVALID_REQUEST)
  }

  async getAll (res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const listaUsers = await this.userService.getAll()
      return res.status(200).json(listaUsers)
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(UserError.USER_INVALID_REQUEST)
  }

  async get (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const user = await this.userService.get(req.params.id)
      if (user != null) {
        return res.status(200).json(user)
      } else {
        return res.status(404).send(UserError.USER_NOT_FOUND)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(UserError.USER_INVALID_REQUEST)
  }

  async update (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const user = await this.userService.update(req.params.id, req.body)
      if (user !== undefined) {
        return res.status(200).json(user)
      } else {
        return res.status(404).send(UserError.USER_NOT_UPDATED)
      }
    } catch (erro) {
      return res.status(400).send(UserError.USER_INVALID_REQUEST)
    }
  }

  async delete (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const user = await this.userService.delete(req.params.id)
      if (user != null) {
        return res.status(200).json(user)
      } else {
        return res.status(404).send(UserError.USER_NOT_DELETED)
      }
    } catch (erro) {
      console.error(erro)
      return res.status(400).send(UserError.USER_INVALID_REQUEST)
    }
  }
}

export default UserController
