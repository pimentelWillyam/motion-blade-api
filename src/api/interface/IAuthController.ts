import { type Request, type Response } from 'express'

interface IAuthController {
  authenticate: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  validate: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
}

export default IAuthController
