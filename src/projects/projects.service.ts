import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  PROJECT_PRIORITY,
  PROJECT_STATUS,
  ResCreateProject,
  ResGetProjectByIdAndOrg,
} from './types/projects.type';
import { RequestWithOrgAndUser } from 'src/common/types/request-with-org';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProjectsService {
  constructor(private readonly ProjectsRepository: ProjectsRepository) {}

  async createProject(
    context: RequestWithOrgAndUser['context'],
    dto: CreateProjectDto,
  ): Promise<{ data: ResCreateProject; message: string }> {
    try {
      const due_date = dto.due_date ?? null;
      const priority = dto.priority ?? PROJECT_PRIORITY.LOW;
      const project = await this.ProjectsRepository.createProject(
        context.organization_id,
        dto.name,
        dto.description,
        due_date,
        PROJECT_STATUS.ACTIVE,
        priority,
        context.user_id,
      );

      if (!project) {
        throw new InternalServerErrorException('Project creation failed');
      }
      return {
        data: project,
        message: `Project named ${dto.name} created successfully`,
      };
    } catch (err) {
      if (err?.code === '23505') {
        throw new BadRequestException('Project with this name already exists');
      }
      throw err;
    }
  }

  async getProjectById(
    project_id: string,
    context:RequestWithOrgAndUser['context'],
  ): Promise<{ data: ResGetProjectByIdAndOrg; message: string }> {
     const trimmedId = project_id.trim();

  if (!trimmedId || !isUUID(trimmedId)) {
    throw new BadRequestException('Invalid project id');
  }


    let project = await this.ProjectsRepository.getProjectByIdAndOrgId(
      project_id,
      context.organization_id,
    );

    if (!project) {
      throw new NotFoundException('Project now found');
    }

    return {
      data: project,
      message: 'Project found',
    };
  }
}
