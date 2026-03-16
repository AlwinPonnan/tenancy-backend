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
      [slug]
    );

    return rows[0] || null;
  }

  async createOrganizations(
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
    [name, slug]
  );

  return result.rows[0];
}
}