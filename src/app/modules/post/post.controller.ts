import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ResponseMessage } from 'src/app/common/response/response-message.decorator';
import { FindAllPostQueryDto } from './dto/post.query.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ResponseMessage("Post created successfully!")
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ResponseMessage("Posts retrived successfully!")
  findAll(@Query() query: FindAllPostQueryDto) {
    return this.postService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage("Post Details Retrived successfully!")
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
