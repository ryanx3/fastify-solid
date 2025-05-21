import type { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import type { User } from 'generated/prisma'

interface RegisterUserRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private prismaUsersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 4)

    const userWithSameEmail =
      await this.prismaUsersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.prismaUsersRepository.create({
      name,
      email,
      password_hash,
    })

    return {
      user,
    }
  }
}
