import { PrismaService } from './../../../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostQueryDto } from './dto/post.query.dto';

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
            email: true,
          },
        },
      },
    });
    return post;
  }

  async findAll({ page = 1, limit = 10, search, isFeatured, tag, sortBy = 'createdAt', sortOrder = 'desc' }: FindAllPostQueryDto) {
    const skip = (page - 1) * limit;
    const tags = tag ? tag.split(',') : undefined;
    const where: any = {
      AND: [
        search && {
          OR: [
            {
              title: { contains: search, mode: 'insensitive' },
              content: { contains: search, mode: 'insensitive' },
            },
          ],
        },
        typeof isFeatured === 'boolean' && { isFeatured },
        tags && tags.length > 0 && { tags: { hasEvery: tags } },
      ].filter(Boolean),
    };

    const posts = await this.prisma.post.findMany({
      skip,
      take: limit,
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const total = await this.prisma.post.count({ where });

    return {
      data: posts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('This post is not avaiable in our db');
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('This post is not avaiable in our db');
    }

    const updatedPost = await this.prisma.post.update({
      where: {
        id,
      },
      data: updatePostDto,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return updatedPost;
  }

  async remove(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('This post is not avaiable in our db');
    }

    await this.prisma.post.delete({ where: { id } } )
    return null;
  }
}
