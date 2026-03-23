import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(name: string, email: string, password: string) {
    const id = uuid();

    const normalizedEmail = email.trim().toLowerCase();

    const password_hash = await bcrypt.hash(password, 10);

    await this.usersRepository.createUser(
      id,
      name,
      normalizedEmail,
      password_hash,
    );

    return { id, email: normalizedEmail };
  }

  async getUserByEmail(email: string) {
    const normalizedEmail = email.toLowerCase();

   let response = await this.usersRepository.findByEmail(normalizedEmail); 
    console.log(response, "response from get by email");
    return response;
  }
}
