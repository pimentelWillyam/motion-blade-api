import type UserRepository from '../repository/UserRepository'
import type Crypto from '../../helper/Crypto'
import type TokenManager from '../../helper/TokenManager'
import type INewAuthService from '../interface/IAuthService'

class AuthService implements INewAuthService {
  constructor (readonly userRepository: UserRepository, readonly crypto: Crypto, readonly tokenManager: TokenManager) {}
  async authenticate (login: string, password: string): Promise<Record<string, unknown> | null> {
    const user = await this.userRepository.getByLogin(login)
    if (user == null) {
      return null
    }
    if (await this.crypto.areTheyHashmatched(password, user.password as string)) {
      return { login: user.login, type: user.type, token: this.tokenManager.generate(user.id as string) }
    } else {
      return null
    }
  }

  validate (token: string): boolean {
    token = token.substring(7, token.length)
    return this.tokenManager.isValid(token)
  }
}

export default AuthService
