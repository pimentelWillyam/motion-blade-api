// importing external libraries
import { Server } from 'http'
import * as dotenv from 'dotenv-safe'
import * as express from 'express'

// importing helpers
import Api from './helper/Api'
import TokenManager from './helper/TokenManager'
import ApiMiddleware from './helper/ApiMiddleware'
import Crypto from './helper/Crypto'
import Sleeper from './helper/Sleeper'
import UuidGenerator from './helper/UuidGenerator'
import DateManager from './helper/DateManager'

// importing data classes
import MariadbDataSource from './data/MariadbDataSource'
// importing routers
import LogRouter from './api/router/LogRouter'
import UserRouter from './api/router/UserRouter'
import AuthRouter from './api/router/AuthRouter'

// importing controllers
import LogController from './api/controller/LogController'
import UserController from './api/controller/UserController'
import AuthController from './api/controller/AuthController'

// importing validators
import LogValidator from './api/validator/LogValidator'
import UserValidator from './api/validator/UserValidator'

// importing services
import LogService from './api/service/LogService'
import UserService from './api/service/UserService'
import AuthService from './api/service/AuthService'

// importing repositories
import LogRepository from './api/repository/LogRepository'
import UserRepository from './api/repository/UserRepository'

// importing entities
// import FileEntity from './api/entity/FileEntity'
// import LogEntity from './api/entity/LogEntity'
// import UserEntity from './api/entity/UserEntity'

// importing app
import App from './api/App'
import DatabaseHelper from './helper/DatabaseHelper'

// instanciating helpers
const crypto = new Crypto()
const uuidGenerator = new UuidGenerator()
const dateManager = new DateManager()
const tokenManager = new TokenManager()
const server = new Server()
const apiMiddleware = new ApiMiddleware()

// instanciating data classes
const databaseHelper = new DatabaseHelper()
const mariadbDataSource = new MariadbDataSource(databaseHelper)
// const oracledbDataSource = new OracledbDataSource()

// instanciating repositories
// using repositories with mariadb
const logRepository = new LogRepository(mariadbDataSource, uuidGenerator, dateManager)
const userRepository = new UserRepository(mariadbDataSource)

// using repositories with oracledb
// const fileRepository = new FileRepository(oracledbDataSource, fileManager, uuidGenerator)
// const logRepository = new LogRepository(oracledbDataSource, uuidGenerator, dateManager)
// const userRepository = new UserRepository(oracledbDataSource)

// instanciating services
const logService = new LogService(logRepository, uuidGenerator, dateManager)
const userService = new UserService(userRepository, crypto, uuidGenerator, dateManager)
const authService = new AuthService(userRepository, crypto, tokenManager)

// instanciating validators
const logValidator = new LogValidator()
const userValidator = new UserValidator(userRepository)

// instanciating controllers
const logController = new LogController(logService, logValidator)
const userController = new UserController(userService, userValidator)
const authController = new AuthController(authService, userRepository, crypto, tokenManager)

// instanciating routers
const logRouter = new LogRouter(logController)
const userRouter = new UserRouter(userController)
const authRouter = new AuthRouter(authController)

// instanciating app related classes
const api = new Api(express(), apiMiddleware, logRouter, userRouter, authRouter)
const app = new App(api, server)

// getting .env configuration
dotenv.config()

// starting database and app
void mariadbDataSource.openConnectionPool()
// void oracledbDataSource.openConnectionPool()
app.start()
