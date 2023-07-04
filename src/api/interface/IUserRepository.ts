import type UserEntity from '../entity/UserEntity'
import type IDataSource from './IDataSource'

interface IUserRepository {
  readonly dataSource: IDataSource

  create: (id: string, login: string, password: string, email: string, type: string) => Promise<Record<string, unknown>>
  getAll: () => Promise<unknown[] | null>
  get: (id: string) => Promise<Record<string, unknown> | null>
  getByLogin: (login: string) => Promise<Record<string, unknown> | null>
  getByEmail: (email: string) => Promise<Record<string, unknown> | null>
  update: (id: string, body: UserEntity) => Promise<Record<string, unknown> | null>
  delete: (id: string) => Promise<Record<string, unknown> | null>
}

export default IUserRepository
