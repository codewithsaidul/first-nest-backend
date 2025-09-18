import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllUsersQueryDto } from './dto/user-query.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const isUserExist = await this.prisma.users.findUnique({ where: { email } });

    if (isUserExist) {
      throw new ConflictException('User already exist');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.users.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return newUser;
  }

  async findAll({ page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' }: FindAllUsersQueryDto) {
    const skip = (page - 1) * limit;
    const where: any = search && {
      OR: [
        {
          name: { contains: search, mode: 'insensitive' },
          email: { contains: search, mode: 'insensitive' },
        },
      ],
    };
    const allUsers = await this.prisma.users.findMany({
      skip,
      take: limit,
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const total = await this.prisma.users.count({ where });

    return {
      data: allUsers,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new NotFoundException('Requested user does exist on database!');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Requested user does exist on database!');
    }

    const updateUser = await this.prisma.users.update({ 
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
     })
    return updateUser;
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
