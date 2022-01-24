import { prisma } from "../../../database/prismaClient";
import { hash } from "bcrypt";
import AppError from "../../../errors/AppError";

interface ICreateDeliveryman {
  username: string;
  password: string;
}

export class CreateDeliverymanUseCase {
  async execute({username, password}: ICreateDeliveryman) {
    const deliverymanExist = await prisma.deliveryman.findFirst({
      where: {
        username: {
          endsWith: username,
          mode: 'insensitive',
        }
      }
    })

    if(deliverymanExist) {
      throw new AppError(`Client ${username} already exists`);
    }

    const hashPassword = await hash(password, 10);

    const deliveryman  = await prisma.deliveryman.create({
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

    return deliveryman;
  }
}
