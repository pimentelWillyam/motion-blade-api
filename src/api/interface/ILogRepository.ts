import type ILogEntity from '../interface/ILogEntity'
import type IMariadbDataSource from './IMariadbDataSource'

interface ILogRepository {
  readonly dataSource: IMariadbDataSource

  create: (id: string, message: string, date: string) => Promise<Record<string, unknown>>
  getAll: () => Promise<unknown[] | null>
  get: (id: string) => Promise<Record<string, unknown> | null>
  update: (id: string, body: ILogEntity) => Promise<Record<string, unknown> | null>
  delete: (id: string) => Promise<Record<string, unknown> | null>
}

export default ILogRepository
