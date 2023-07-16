import type IApiMiddleware from '../api/interface/IApiMiddleware'
import { type Express } from 'express'
import type IAuthRouter from '../api/interface/IAuthRouter'
import type ILogRouter from '../api/interface/ILogRouter'
import type IUserRouter from '../api/interface/IUserRouter'

import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import { json } from 'express'

class Api {
  constructor (readonly server: Express, readonly apiMiddleware: IApiMiddleware, readonly logRouter: ILogRouter, readonly userRouter: IUserRouter, readonly authRouter: IAuthRouter) {
    this.server.use(bodyParser.json())
    this.server.use(json())
    this.server.use(cors())
    this.server.use('/api', logRouter.routes)
    this.server.use('/api', userRouter.routes)
    this.server.use('/api', authRouter.routes)
  }
}

export default Api
