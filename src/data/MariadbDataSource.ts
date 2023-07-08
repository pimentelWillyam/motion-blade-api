import config from '../config'

import * as mariadb from 'mariadb'
import type { Connection, Pool } from 'mariadb'

import type IDatabaseHelper from '../api/interface/IDatabaseHelper'
import type IMariadbDataSource from '../api/interface/IMariadbDataSource'

class MariadbDataSource implements IMariadbDataSource {
  private connection: Connection | undefined
  private pool: Pool | undefined

  constructor (readonly databaseHelper: IDatabaseHelper) {}

  async startConnection (): Promise<boolean> {
    console.log('connection started')
    this.connection = await mariadb.createConnection({ host: config.mariadb.host, user: config.mariadb.username, password: config.mariadb.password })
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

  async stopConnection (): Promise<boolean> {
    if (this.connection === undefined) {
      return false
    }
    console.log('connection stopped')
    await this.connection.end()
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

  async insertRegistryIntoTable (database: string, tableName: string, columnList: string[], propertyList: string[]): Promise<boolean> {
    const columns = this.databaseHelper.getColumnsFromColumnListForInsertion(columnList)
    const properties = this.databaseHelper.getPropertiesFromPropertyListForInsertion(propertyList)
    await this.pool?.query('INSERT INTO ' + database + '.' + tableName + ' (' + columns + ') VALUES (' + properties + ');')
    return true
  }

  async getRegistryBy (databaseName: string, tableName: string, parameter: string, expectedValue: string): Promise<unknown[]> {
    const data = await this.pool?.query('SELECT * FROM ' + databaseName + '.' + tableName + ' WHERE ' + parameter + "= '" + expectedValue + "';")
    return data
  }

  async updateRegistryById (databaseName: string, tableName: string, id: string, columnList: string[], registryList: string[]): Promise<boolean> {
    const columnsAndRegistriesToUpdate = this.databaseHelper.getColumnsAndRegistriesToUpdate(columnList, registryList)
    await this.pool?.query('UPDATE ' + databaseName + '.' + tableName + ' SET ' + columnsAndRegistriesToUpdate + " WHERE id = '" + id + "';")
    return true
  }

  async updateRegistryBy (databaseName: string, tableName: string, whereParameter: string, whereValue: string, columnList: string[], registryList: string[]): Promise<boolean> {
    const columnsAndRegistriesToUpdate = this.databaseHelper.getColumnsAndRegistriesToUpdate(columnList, registryList)
    // await this.pool?.query('UPDATE ' + tableName + ' SET ' + column + ' = ' + newContent + 'WHERE id =' + id + ';')
    const res = await this.pool?.query('UPDATE ' + databaseName + '.' + tableName + ' SET ' + columnsAndRegistriesToUpdate + ' WHERE ' + whereParameter + " = '" + whereValue + "';")
    console.log(res)
    return true
  }

  async deleteRegistryBy (databaseName: string, tableName: string, whereParameter: string, whereValue: string): Promise<boolean> {
    await this.pool?.query('DELETE FROM ' + databaseName + '.' + tableName + ' WHERE ' + whereParameter + " = '" + whereValue + "';")
    return true
  }
}

export default MariadbDataSource
