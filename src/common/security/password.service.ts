import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordService {
  private bcryptCost: number;
  private readonly dummyHash = "$2b$12$C6UzMDM.H6dfI/f/IKcEeOQeV9Cq0b4x8yG4Xy6h2s8N2s8zK9uG6";
  constructor(private configService: ConfigService) {
    this.bcryptCost = this.configService.getOrThrow<number>('auth.bcryptCost');
  }

  needsRehash(hash: string): boolean {
    try {
      const currentRounds = bcrypt.getRounds(hash);
      return currentRounds < this.bcryptCost;
    } catch (error) {
      return false;
    }
  }

  async compare(
    password:string,
    password_hashed:string = this.dummyHash,
  ): Promise<{
    valid: boolean;
    needsRehash: boolean;
  }> {
    const isValidPass = await bcrypt.compare(password, password_hashed);
    let needsRehash = false;
    if (isValidPass) {
      needsRehash = this.needsRehash(password_hashed);
    }
    return {
      valid: isValidPass,
      needsRehash: needsRehash,
    };
  }

  async hash(pass): Promise<string> {
    const hashedPass = await bcrypt.hash(pass, this.bcryptCost);
    return hashedPass;
  }
}
