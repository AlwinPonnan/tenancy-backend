import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { DatabaseService } from 'src/database/database.service';
import { ProjectsRepository } from './projects.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenService } from 'src/auth/jwt-token.service';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { MembershipsRepository } from 'src/memberships/memberships.repository';

@Module({
  providers: [
    ProjectsService,
    DatabaseService,
    ProjectsRepository,
    JwtService,
    JwtTokenService,
    TenantGuard,
    MembershipsRepository,
  ],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
