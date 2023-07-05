// importando core da rota
import * as express from 'express'
import { type Request, type Response } from 'express'

import type IAuthRouter from '../interface/IAuthRouter'
import type IAuthController from '../interface/IAuthController'

class AuthRouter implements IAuthRouter {
  constructor (readonly authController: IAuthController, readonly routes = express.Router()) {
    this.routes.post('/auth', (req: Request, res: Response) => {
      this.authController.authenticate(req, res)
    })
    this.routes.get('/auth', (req: Request, res: Response) => {
      this.authController.validate(req, res)
    })
  }
}

export default AuthRouter
