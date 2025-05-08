import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { hash } from 'bcryptjs'

interface RegisterUserRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private prismaUsersRepository: any) {}

  async execute({ name, email, password }: RegisterUserRequest) {
    const password_hash = await hash(password, 4)

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new Error('Email already exists')
    }

    this.prismaUsersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
