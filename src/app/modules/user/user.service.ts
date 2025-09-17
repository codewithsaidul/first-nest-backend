import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from "bcrypt"
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor (private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const isUserExist = await this.prisma.users.findUnique({ where: { email } })

    if (isUserExist) {
      throw new ConflictException("User already exist")
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.users.create({
      data: {
        name, email, password: hashPassword
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })
    return newUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}