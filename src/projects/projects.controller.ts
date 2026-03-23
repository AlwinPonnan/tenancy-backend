import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import type { RequestWithOrgAndUser } from 'src/common/types/request-with-org';
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @UseGuards(AccessTokenGuard, TenantGuard)
  @Post()
  async createProject(
    @Req() req: RequestWithOrgAndUser,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectService.createProject(req.context, dto);
  }

  @UseGuards(AccessTokenGuard, TenantGuard)
  @Get('/:id')
  async getProjectbyId(
    @Req() req: RequestWithOrgAndUser,
    @Param('id') id: string,
  ) {
    return this.projectService.getProjectById(id, req.context);
  }
}
