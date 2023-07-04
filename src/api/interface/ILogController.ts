import { type Request, type Response } from 'express'
import type ILogValidator from './ILogValidator'
import type ILogService from './ILogService'

interface ILogController {
  readonly logService: ILogService
  readonly logValidator: ILogValidator

  create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  getAll: (res: Response) => Promise<Response<any, Record<string, any>>>
  get: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  delete: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
}

export default ILogController
