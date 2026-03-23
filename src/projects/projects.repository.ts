import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  ProjectPriority,
  ProjectStatus,
  ResCreateProject,
  ResGetProjectByIdAndOrg,
  ResGetProjectsByOrgAndUser,
} from './types/projects.type';

@Injectable()
export class ProjectsRepository {
  constructor(private db: DatabaseService) {}

  async createProject(
    organization_id: string,
    name: string,
    description: string,
    due_date: Date,
    status: ProjectStatus,
    priority: ProjectPriority,
    created_by: string,
  ): Promise<ResCreateProject> {
    const result = await this.db.query(
      `
      INSERT INTO projects (id, organization_id, name, description,due_date,status,priority,created_by)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
      RETURNING id, organization_id, name, created_by
      `,
      [
        organization_id,
        name,
        description,
        due_date,
        status,
        priority,
        created_by,
      ],
    );

   return result.rows[0] ?? null;
  }

  async getProjectByIdAndOrgId(
    id: string,
    organization_id: string,
  ): Promise<ResGetProjectByIdAndOrg> {
    const result = await this.db.query(
      `
        SELECT id,organization_id,name,description,status,priority,due_date from projects p 
        WHERE p.id = $1 
        AND p.organization_id = $2 
        AND deleted_at IS NULL
        LIMIT 1;
      `,
      [id, organization_id],
    );

   return result.rows[0] ?? null;
  }



   async getProjectsByOrgId(
    organization_id: string,
    limit:number,
    offset:number
  ): Promise<ResGetProjectByIdAndOrg[]> {
    const result = await this.db.query(
      `
        SELECT id, organization_id, name, description, status, priority, due_date, created_at
        FROM projects p
        WHERE p.organization_id = $1
          AND p.deleted_at IS NULL
        ORDER BY p.created_at DESC
        LIMIT $2
        OFFSET $3;
        ;
      `,
      [organization_id, limit, offset],
    );

    return result.rows;
  }



  async deleteProjectById(
    id:string,
    organization_id: string, 
  ): Promise<ResGetProjectByIdAndOrg> {
    const result = await this.db.query(
      `
        UPDATE projects
        SET deleted_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
          AND organization_id = $2
          AND deleted_at IS NULL
        RETURNING id, organization_id;
        ;
      `,
      [id,organization_id],
    );

   return result.rows[0] ?? null;
  }
}
