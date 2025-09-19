import { PrismaService } from './../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}


  async create(createPostDto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: createPostDto,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    return post;
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
