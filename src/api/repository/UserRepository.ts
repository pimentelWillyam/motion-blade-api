
import config from '../../config'

import type IUserRepository from '../interface/IUserRepository'
import type IUserEntity from '../interface/IUserEntity'
import type IMariadbDataSource from '../interface/IMariadbDataSource'

class UserRepository implements IUserRepository {
  constructor (readonly dataSource: IMariadbDataSource) { this.dataSource = dataSource }
  async create (id: string, login: string, password: string, email: string, type: string): Promise<Record<string, unknown>> {
    await this.dataSource.insertRegistryIntoTable(config.mariadb.productionDatabase, 'user', ['id', 'login', 'password', 'email', 'type'], [id, login, password, email, type])
    const user = { id, login, password, email, type }
    return user
  }

  async getAll (): Promise<unknown[] | null> {
    const allUsers = await this.dataSource.getEverythingFromTable(config.mariadb.productionDatabase, 'user')
    return allUsers
  }

  async get (id: string): Promise<Record<string, unknown> | null> {
    const userList = await this.dataSource.getRegistryBy(config.mariadb.productionDatabase, 'user', 'id', id)
    const user = userList[0]
    if (user == null) {
      return null
    }
    return user as Record<string, unknown>
  }

  async getByLogin (login: string): Promise<Record<string, unknown> | null> {
    const userList = await this.dataSource.getRegistryBy(config.mariadb.productionDatabase, 'user', 'login', login)
    const user = userList[0]
    return user as Record<string, unknown>
  }

  async getByEmail (email: string): Promise<Record<string, unknown> | null> {
    const userList = await this.dataSource.getRegistryBy(config.mariadb.productionDatabase, 'user', 'email', email)
    const user = userList[0]
    return user as Record<string, unknown>
  }

  async update (id: string, body: IUserEntity): Promise<Record<string, unknown> | null> {
    const userList = await this.dataSource.getRegistryBy(config.mariadb.productionDatabase, 'user', 'id', id)
    const user = userList[0] as Record<string, unknown>
    if (user === undefined) {
      return user
    }
    if (body.password !== undefined) {
      user.password = body.password
    }
    if (body.email !== undefined) {
      user.email = body.email
    }
    if (body.type !== undefined) {
      user.type = body.type
    }
    await this.dataSource.updateRegistryBy(config.mariadb.productionDatabase, 'user', 'id', id, ['id', 'login', 'password', 'email', 'type'], [user.id as string, user.login as string, user.password as string, user.email as string, user.type as string])
    return user
  }

  async delete (id: string): Promise<Record<string, unknown> | null> {
    const userList = await this.dataSource.getRegistryBy(config.mariadb.productionDatabase, 'user', 'id', id)
    const user = userList[0] as Record<string, unknown>
    if (user === undefined) {
      return user
    } else {
      await this.dataSource.deleteRegistryBy(config.mariadb.productionDatabase, 'user', 'id', id)
      return user
    }
  }
}

export default UserRepository
