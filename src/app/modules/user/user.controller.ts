import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/app/common/response/response-message.decorator';
import { FindAllUsersQueryDto } from './dto/user-query.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ResponseMessage('User created successfully!')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ResponseMessage("All User retrive successfully")
  findAll(@Query() query: FindAllUsersQueryDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage("Single User Data retrive suuccessfully!")
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("User info updated successfully!")
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ResponseMessage("User Deleted Successfully!")
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
