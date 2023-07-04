import type IUserEntity from './IUserEntity'

interface IUserService {
  create: (login: string, password: string, email: string, type: string) => Promise<Record<string, unknown>>
  getAll: () => Promise<unknown[] | null>
  get: (id: string) => Promise<Record<string, unknown> | null>
  update: (id: string, body: IUserEntity) => Promise<Record<string, unknown> | null>
  delete: (id: string) => Promise<Record<string, unknown> | null>
}

export default IUserService
