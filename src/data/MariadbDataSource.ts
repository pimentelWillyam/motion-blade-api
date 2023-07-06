import config from '../config'

import * as mariadb from 'mariadb'
import type { Connection, Pool } from 'mariadb'

import type IDataSource from '../api/interface/IDataSource'
import type IDatabaseHelper from '../api/interface/IDatabaseHelper'

class MariadbDataSource implements IDataSource {
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

  async setupDatabase (databaseToBeUsed: string): Promise<boolean> {
    if (!await this.databaseExists(databaseToBeUsed)) {
      await this.createDatabase(databaseToBeUsed)
    }
    await this.pool?.query('USE ' + databaseToBeUsed)
    if (!await this.everyNecessaryTableHaveBeenCreated()) {
      await this.createNecessaryTables()
    }
    return true
  }

  async createDatabase (databaseName: string): Promise<boolean> {
    console.log('creating new database')
    await this.pool?.query('CREATE DATABASE ' + databaseName + ';')
    return true
  }

  async databaseExists (databaseName: string): Promise<boolean> {
    const databaseList = await this.pool?.query("SHOW DATABASES LIKE '" + databaseName + "' ;")
    if (databaseList.length === 0) {
      return false
    }
    return true
  }

  async createTable (tableName: string, tableColumns: string): Promise<boolean> {
    console.log('creating new table')
    await this.pool?.query('CREATE TABLE ' + tableName + ' ' + '(' + tableColumns + ')' + ' ;')
    return true
  }

  async tableExists (tableName: string): Promise<boolean> {
    const res = await this.pool?.query("SHOW TABLES FROM intranet LIKE '" + tableName + "' ;")
    if (res[0] == null) {
      return false
    }
    return true
  }

  async everyNecessaryTableHaveBeenCreated (): Promise<boolean> {
    if (!await this.tableExists('file') || !await this.tableExists('log') || !await this.tableExists('user')) {
      await this.createNecessaryTables()
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

  async getEverythingFromTable (database: string, tableName: string): Promise<unknown[]> {
    const tableContent = await this.pool?.query('SELECT * FROM ' + database + '.' + tableName + ';')
    return tableContent
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