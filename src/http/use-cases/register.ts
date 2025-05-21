import type { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUserRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private prismaUsersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUserRequest) {
    const password_hash = await hash(password, 4)

    const userWithSameEmail =
      await this.prismaUsersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    await this.prismaUsersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
