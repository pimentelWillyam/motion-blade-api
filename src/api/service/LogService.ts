import type IUuidGenerator from '../interface/IUuidGenerator'
import type IDateManager from '../interface/IDateManager'
import type ILogRepository from '../interface/ILogRepository'
import type ILogEntity from '../interface/ILogEntity'
import type ILogService from '../interface/ILogService'

class LogService implements ILogService {
  constructor (readonly LogRepository: ILogRepository, readonly uuidGenerator: IUuidGenerator, readonly dateManager: IDateManager) {}

  async create (message: string): Promise<Record<string, unknown>> {
    return await this.LogRepository.create(this.uuidGenerator.generate(), message, this.dateManager.getCurrentDateTime())
  }

  async getAll (): Promise<unknown[] | null> {
    return await this.LogRepository.getAll()
  }

  async get (id: string): Promise<Record<string, unknown> | null> {
    return await this.LogRepository.get(id)
  }

  async update (id: string, body: ILogEntity): Promise<Record<string, unknown> | null> {
    return await this.LogRepository.update(id, body)
  }

  async delete (id: string): Promise<Record<string, unknown> | null> {
    return await this.LogRepository.delete(id)
  }
}

export default LogService
