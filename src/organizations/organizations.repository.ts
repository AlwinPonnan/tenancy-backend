import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from 'src/database/database.service';
import { ResCreateOrg } from './types/create-org.type';

@Injectable()
export class OrganizationsRepository {
  constructor(private db: DatabaseService) {}

  async findBySlug(slug: string) {
    const rows = await this.db.query(
      `SELECT * FROM organizations WHERE slug = $1`,
      [slug],
    );

    return rows[0] || null;
  }

  async findOrgsByUserId(userId: string) {
    const rows = await this.db.query(
      `SELECT o.id, o.name
       FROM memberships m
       JOIN organizations o 
         ON o.id = m.organization_id
       WHERE m.user_id = $1
         AND m.deleted_at IS NULL
         AND o.deleted_at IS NULL;`,
      [userId],
    );

    return rows[0] || null;
  }

  async findOneOrgbyIdAndUserId(orgId: string, userId: string) {
    const {rows} = await this.db.query(
      `SELECT o.id, o.name
     FROM organizations o
     WHERE o.id = $1
       AND o.deleted_at IS NULL
       AND EXISTS (
         SELECT 1
         FROM memberships m
         WHERE m.organization_id = o.id
           AND m.user_id = $2
           AND m.deleted_at IS NULL
       );`,
      [orgId, userId],
    );
    return rows[0] || null;
  }

  
  async createOrganization(
    client: PoolClient,
    name: string,
    slug: string,
  ): Promise<ResCreateOrg> {
    const result = await client.query<ResCreateOrg>(
      `
    INSERT INTO organizations (id, name, slug)
    VALUES (gen_random_uuid(), $1, $2)
    RETURNING id, name, slug
    `,
      [name, slug],
    );

    return result.rows[0];
  }
}
