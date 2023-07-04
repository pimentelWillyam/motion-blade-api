import config from '../../config'

import type IDataSource from '../interface/IDataSource'
import type ILogRepository from '../interface/ILogRepository'
import type IUuidGenerator from '../interface/IUuidGenerator'
import type IDateManager from '../interface/IDateManager'
import type ILogEntity from '../interface/ILogEntity'

class LogRepository implements ILogRepository {
  constructor (readonly dataSource: IDataSource, readonly uuidGenerator: IUuidGenerator, readonly dateManager: IDateManager) {}

  async create (id: string, message: string, date: string): Promise<Record<string, unknown>> {
    const log = { id, date, message }
    await this.dataSource.insertRegistryIntoTable(config.mariadb.productionDatabase, 'log', ['id', 'date', 'message'], [log.id, log.date, log.message])
    return log
  }

  async getAll (): Promise<unknown[] | null> {
    return await this.dataSource.getEverythingFromTable(config.mariadb.productionDatabase, 'log')
  }

  async get (id: string): Promise<Record<string, unknown> | null> {
    const logList = await this.dataSource.getRegistryBy(config.mariadb.productionDatabase, 'log', 'id', id)
    const log = logList[0]
    if (log == null) {
      return null
    }
    return log as Record<string, unknown>
  }

  async update (id: string, body: ILogEntity): Promise<Record<string, unknown> | null> {
    const logList = await this.dataSource.getRegistryBy(config.mariadb.productionDatabase, 'log', 'id', id)
    const log = logList[0] as Record<string, unknown>
    if (log === undefined) {
      return null
    }
    if (body.message !== undefined) {
      log.message = body.message
    }
    if (body.date !== undefined) {
      log.date = body.date
    }
    await this.dataSource.insertRegistryIntoTable(config.mariadb.productionDatabase, 'log', ['id', 'date', 'message'], [log.id as string, log.message as string, log.date as string])
    return log
  }

  async delete (id: string): Promise<Record<string, unknown> | null> {
    const logList = await this.dataSource.getRegistryBy(config.mariadb.productionDatabase, 'log', 'id', id)
    const log = logList[0] as Record<string, unknown>
    if (log === undefined) {
      return log
    } else {
      await this.dataSource.deleteRegistryBy(config.mariadb.productionDatabase, 'log', 'id', id)
      return log
    }
  }
}

export default LogRepository
