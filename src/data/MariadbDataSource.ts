import config from '../config'

import * as mariadb from 'mariadb'
import type { Connection, Pool } from 'mariadb'

import type IDatabaseHelper from '../api/interface/IDatabaseHelper'
import type IMariadbDataSource from '../api/interface/IMariadbDataSource'

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
    const res = await this.pool?.query("SHOW TABLES FROM intranet LIKE '" + tableName + "' ;")
    if (res[0] == null) {
      return false
    }
    return true
  }

  async deleteTable (table: string): Promise<boolean> {
    await this.pool?.query('DROP TABLE ' + table)
    return true
  }

  async createNecessaryTables (): Promise<boolean> {
    await this.createTable('file', 'id VARCHAR(50) NOT NULL, type VARCHAR(50) NOT NULL, date VARCHAR(50) NOT NULL, buffer BLOB NOT NULL ')
    await this.createTable('log', 'id VARCHAR(50) NOT NULL, date VARCHAR(50) NOT NULL, message VARCHAR(50) NOT NULL ')
    await this.createTable('user', 'id VARCHAR(50) NOT NULL, login VARCHAR(50) NOT NULL, password VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL, type VARCHAR(50) NOT NULL ')

    return true
  }
}

export default MariadbDataSource
