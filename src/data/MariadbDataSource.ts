import config from '../config'

import * as mariadb from 'mariadb'
import type { Connection, Pool } from 'mariadb'

import type IDatabaseHelper from '../api/interface/IDatabaseHelper'
import type IMariadbDataSource from '../api/interface/IMariadbDataSource'
import type IServant from '../api/interface/IServant'
import type IBattle from '../api/interface/IBattle'
import type ILogEntity from '../api/interface/ILogEntity'
import type IMaster from '../api/interface/IMaster'
import type Attributes from '../api/type/Attributes'
import type IUserEntity from '../api/interface/IUserEntity'
import Master from '../api/entity/Master'

class MariadbDataSource implements IMariadbDataSource {
  private connection: Connection | undefined
  private pool: Pool | undefined

  constructor (readonly databaseHelper: IDatabaseHelper) {}

  async bootstrap (): Promise<boolean> {
    await this.openConnectionPool()
    await this.createNecessaryDatabases()
    await this.useMotionBladeDatabase()
    await this.createNecessaryTables()
    return true
  }

  async startConnection (): Promise<boolean> {
    console.log('connection started')
    this.connection = await mariadb.createConnection({ host: config.mariadb.host, user: config.mariadb.username, password: config.mariadb.password })
    return true
  }

  async stopConnection (): Promise<boolean> {
    if (this.connection === undefined) {
      return false
    }
    console.log('connection stopped')
    await this.connection.end()
    return true
  }

  async openConnectionPool (): Promise<boolean> {
    this.pool = mariadb.createPool({ host: config.mariadb.host, user: config.mariadb.username, password: config.mariadb.password })
    return true
  }

  async closeConnectionPool (): Promise<boolean> {
    if (this.pool === undefined) {
      return false
    }
    await this.pool.end()
    return true
  }

  async createNecessaryDatabases (): Promise<boolean> {
    if (!await this.motionBladeDatabaseExists()) await this.createMotionBladeDatabase()
    return true
  }

  async createMotionBladeDatabase (): Promise<boolean> {
    await this.pool?.query('CREATE DATABASE motion_blade ;')
    return true
  }

  async useMotionBladeDatabase (): Promise<boolean> {
    await this.pool?.query('USE motion_blade ;')
    return true
  }

  async motionBladeDatabaseExists (): Promise<boolean> {
    const databaseList = await this.pool?.query("SHOW DATABASES LIKE 'motion_blade' ;")
    if (databaseList.length === 0) {
      return false
    }
    return true
  }

  async createBattleTable (): Promise<boolean> {
    console.log('creating battle table')
    await this.pool?.query("CREATE TABLE battle (id UUID NULL, map SET('Value A','Value B') NULL DEFAULT NULL, participants SET('Value A','Value B') NULL DEFAULT NULL) COLLATE='latin1_swedish_ci' ;")
    return true
  }

  async createLogTable (): Promise<boolean> {
    console.log('creating log table')
    await this.pool?.query("CREATE TABLE `log` (`id` UUID NULL, `date` VARCHAR(20) NULL DEFAULT NULL,`message` VARCHAR(50) NULL DEFAULT NULL)COLLATE='latin1_swedish_ci';")
    return true
  }

  async createMasterTable (): Promise<boolean> {
    console.log('creating master table')
    await this.pool?.query("CREATE TABLE `master` (`id` UUID NULL, `name` VARCHAR(50) NULL DEFAULT NULL, `servant_list` SET('Value A','Value B') NULL DEFAULT NULL) COLLATE='latin1_swedish_ci' ;")
    return true
  }

  async createServantTable (): Promise<boolean> {
    console.log('creating servant table')
    await this.pool?.query("CREATE TABLE `servant` (`id` UUID NULL, `atributes` JSON NULL, `is_in_battle` VARCHAR(5) NULL DEFAULT NULL, `battle_position` SET('Value A','Value B') NULL DEFAULT NULL) COLLATE='latin1_swedish_ci' ;")
    return true
  }

  async createUserTable (): Promise<boolean> {
    console.log('creating user table')
    await this.pool?.query("CREATE TABLE `user` (`id` UUID NULL,`login` VARCHAR(50) NULL DEFAULT NULL,`password` VARCHAR(60) NULL DEFAULT NULL,`email` VARCHAR(50) NULL DEFAULT NULL,`type` VARCHAR(50) NULL DEFAULT NULL)COLLATE='latin1_swedish_ci';")
    return true
  }

  async tableExists (tableName: string): Promise<boolean> {
    const res = await this.pool?.query("SHOW TABLES FROM motion_blade LIKE '" + tableName + "' ;")
    if (res[0] == null) {
      return false
    }
    return true
  }

  async createNecessaryTables (): Promise<boolean> {
    if (!await this.tableExists('battle')) await this.createBattleTable()
    if (!await this.tableExists('log')) await this.createLogTable()
    if (!await this.tableExists('master')) await this.createMasterTable()
    if (!await this.tableExists('servant')) await this.createServantTable()
    if (!await this.tableExists('user')) await this.createUserTable()
    return true
  }

  async insertBattleRegistry (id: string, map: number[][], participants: IServant[]): Promise<IBattle> {
    await this.pool?.query('')
    return { id, map, participants }
  }

  async insertLogRegistry (id: string, date: string, message: string): Promise<ILogEntity> {
    await this.pool?.query(`INSERT INTO motion_blade.log (id, date, message) VALUES ('${id}', '${date}', '${message}');`)
    return { id, date, message }
  }

  async insertMasterRegistry (id: string, name: string, servantList: IServant[]): Promise<IMaster> {
    await this.pool?.query(`INSERT INTO motion_blade.master (id, name, servant_list) VALUES ('${id}', '${name}', '${servantList}');`)
    return { id, name, servantList }
  }

  async insertServantRegistry (id: string, masterId: string, name: string, profession: string, seniority: number, attributes: Attributes, isInBattle: boolean, battlePosition: [number, number]): Promise<IServant> {
    await this.pool?.query(`INSERT INTO motion_blade.servant (id, master_id, name, profession, seniority, attributes, is_in_battle, battle_position ) VALUES ('${id}', '${masterId}', '${name}', '${profession}', '${seniority}', '${attributes}', '${isInBattle}', '${battlePosition}' ;`)
    return { id, masterId, name, profession, seniority, attributes, isInBattle, battlePosition }
  }

  async insertUserRegistry (id: string, login: string, password: string, email: string, type: string): Promise<IUserEntity> {
    await this.pool?.query(`INSERT INTO motion_blade.servant (id, login, password, email, type) VALUES ('${id}', '${login}', '${password}', '${email}', '${type}' ;`)
    return { id, login, password, email, type }
  }

  async getEveryBattleRegistry (): Promise<IBattle[]> {
    return await this.pool?.query('SELECT * FROM intranet.battle ;') as IBattle[]
  }

  async getEveryLogRegistry (): Promise<ILogEntity[]> {
    return await this.pool?.query('SELECT * FROM intranet.log ;') as ILogEntity[]
  }

  async getEveryMasterRegistry (): Promise<IMaster[]> {
    return await this.pool?.query('SELECT * FROM intranet.master ;') as IMaster[]
  }

  async getEveryServantRegistry (): Promise<IServant[]> {
    return await this.pool?.query('SELECT * FROM intranet.servant ;') as IServant[]
  }

  async getEveryUserRegistry (): Promise<IUserEntity[]> {
    return await this.pool?.query('SELECT * FROM intranet.user ;') as IUserEntity[]
  }

  async getBattleBy (parameter: string, value: string): Promise<IBattle> {
    return await this.pool?.query(`SELECT * FROM intranet.battle WHERE ${parameter} = ${value} ;`) as IBattle
  }

  async getLogBy (parameter: string, value: string): Promise<ILogEntity> {
    return await this.pool?.query(`SELECT * FROM intranet.log WHERE ${parameter} = ${value} ;`) as ILogEntity
  }

  async getMasterBy (parameter: string, value: string): Promise<IMaster> {
    return await this.pool?.query(`SELECT * FROM intranet.master WHERE ${parameter} = ${value} ;`) as IMaster
  }

  async getServantBy (parameter: string, value: string): Promise<IServant> {
    return await this.pool?.query(`SELECT * FROM intranet.master WHERE ${parameter} = ${value} ;`) as IServant
  }
}

export default MariadbDataSource
