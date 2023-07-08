import type ILogEntity from './ILogEntity'
import type IUserEntity from './IUserEntity'

interface IMariadbDataSource {
  startConnection: () => Promise<boolean>
  stopConnection: () => Promise<boolean>
  openConnectionPool: () => Promise<boolean>
  closeConnectionPool: () => Promise<boolean>
  createMotionBladeDatabase: () => Promise<boolean>
  motionBladeDatabaseExists: () => Promise<boolean>
  createBattleTable: () => Promise<boolean>
  createLogTable: () => Promise<boolean>
  createMasterTable: () => Promise<boolean>
  createServantTable: () => Promise<boolean>
  createUserTable: () => Promise<boolean>
  tableExists: (tableName: string) => Promise<boolean>
  createNecessaryTables: () => Promise<boolean>
  insertBattleRegistry: (unknown: unknown) => Promise<unknown>
  insertLogRegistry: (id: string, date: string, message: string) => Promise<ILogEntity>
  insertMasterRegistry: (unknown: unknown) => Promise<unknown>
  insertServantRegistry: (unknown: unknown) => Promise<unknown>
  insertUserRegistry: (id: string, loginlogin: string, password: string, email: string, type: string) => Promise<IUserEntity>
  getEveryBattleRegistry: (unknown: unknown) => Promise<unknown>
  getEveryLogRegistry: () => Promise<ILogEntity[]>
  getEveryMasterRegistry: (unknown: unknown) => Promise<unknown>
  getEveryServantRegistry: (unknown: unknown) => Promise<unknown>
  getEveryUserRegistry: () => Promise<IUserEntity[]>
  getBattleBy: (parameter: string, value: string) => Promise<unknown[]>
  getLogBy: (parameter: string, value: string) => Promise<ILogEntity[]>
  getMasterBy: (parameter: string, value: string) => Promise<unknown[]>
  getServantBy: (parameter: string, value: string) => Promise<unknown[]>
  getUserBy: (parameter: string, value: string) => Promise<IUserEntity[]>
  updateBattleById: (unknown: unknown) => Promise<unknown[]>
  updateMasterById: (unknown: unknown) => Promise<unknown[]>
  updateServantById: (unknown: unknown) => Promise<unknown[]>
  deleteBattleById: (id: string) => Promise<boolean>
  deleteUserById: (id: string) => Promise<boolean>
  deleteMasterById: (id: string) => Promise<boolean>
  deleteServantById: (id: string) => Promise<boolean>
  updateUserById: (id: string, login: string, password: string, email: string, type: string) => Promise<IUserEntity>
}

export default IMariadbDataSource
