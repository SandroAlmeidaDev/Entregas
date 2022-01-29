import { prisma } from "../../../../database/prismaClient";
import { hash } from "bcrypt";
import AppError from "../../../../errors/AppError";

interface ICreateClient {
  username: string;
  password: string;
}

export class CreateClientUseCase {
  async execute({username, password}: ICreateClient) {
    // Validar se o client existe
    const clientExist = await prisma.clients.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        }
      }
    })

    if(clientExist ) {
      throw new AppError(`Client ${username} already exists`);
    }

    const hashPassword = await hash(password, 10);

    const client  = await prisma.clients.create({
      data: {
        username,
        password: hashPassword,
      },
      select: {
        id: true,
        username: true,
        password: false
      }
    })

    return client;
  }
}
