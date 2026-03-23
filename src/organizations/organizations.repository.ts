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

  async findOrgsByuser_id(user_id: string) {
    const rows = await this.db.query(
      `SELECT o.id, o.name
       FROM memberships m
       JOIN organizations o 
         ON o.id = m.organization_id
       WHERE m.user_id = $1
         AND m.deleted_at IS NULL
         AND o.deleted_at IS NULL;`,
      [user_id],
    );

    return rows[0] || null;
  }

  async findOneOrgbyIdAnduser_id(organization_id: string, user_id: string) {
    const { rows } = await this.db.query(
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
      [organization_id, user_id],
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

  async checkOrgIsValid(organization_id: string): Promise<{ exists: Boolean }> {
    const result = await this.db.query(
      `
       SELECT exists (SELECT 1 from organizations o where o.id = $1 and o.deleted_at is null);
      `,
      [organization_id],
    );

    return result.rows[0];
  }
}
