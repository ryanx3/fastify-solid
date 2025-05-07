import { PrismaClient } from '../generated/prisma'
import fastify from 'fastify'

export const app = fastify()
export const prisma = new PrismaClient()
