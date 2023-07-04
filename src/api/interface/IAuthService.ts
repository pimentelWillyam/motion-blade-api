interface IAuthService {
  authenticate: (login: string, password: string) => Promise<Record<string, unknown> | null>
  validate: (token: string) => boolean
}

export default IAuthService
