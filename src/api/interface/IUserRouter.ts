import type { Router } from 'express'

import type IUserController from './IUserController'

interface IUserRouter {
  readonly userController: IUserController
  readonly routes: Router
}

export default IUserRouter
