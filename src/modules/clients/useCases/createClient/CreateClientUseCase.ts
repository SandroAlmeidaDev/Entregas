import { prisma } from "../../../../database/prismaClient";
import { hash } from "bcrypt";

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
          endsWith: 'prisma.io',
          mode: 'insensitive', 
        }
      }
    })

    if(clientExist) {
      throw new Error(`Client ${username} already exists`);
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
