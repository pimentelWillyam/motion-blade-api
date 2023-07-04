import type LogEntity from '../entity/LogEntity'

interface ILogService {
  create: (message: string) => Promise<Record<string, unknown>>
  getAll: () => Promise<unknown[] | null>
  get: (id: string) => Promise<Record<string, unknown> | null>
  update: (id: string, body: LogEntity) => Promise<Record<string, unknown> | null>
  delete: (id: string) => Promise<Record<string, unknown> | null>
}

export default ILogService
