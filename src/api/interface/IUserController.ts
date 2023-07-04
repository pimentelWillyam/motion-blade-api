import { type Request, type Response } from 'express'
import type IUserValidator from './IUserValidator'
import type IUserService from './IUserService'

interface IUserController {
  readonly userService: IUserService
  readonly userValidator: IUserValidator

  create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  getAll: (res: Response) => Promise<Response<any, Record<string, any>>>
  get: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  delete: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
}

export default IUserController
