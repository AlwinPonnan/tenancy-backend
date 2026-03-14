import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(
    @Body() body: { name: string; email: string; password: string }
  ) {
    return this.usersService.createUser(
      body.name,
      body.email,
      body.password
    );
  }


  @Get("getByEmail")
  async getUserByEmail(
    @Query("email") email:string 
  ){
    console.log(email, "email");
    return this.usersService.getUserByEmail(email);
  }
}