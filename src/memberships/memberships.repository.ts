import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from 'src/database/database.service';
import { ResCreateMembership } from './types/create-membership.type';

@Injectable()
export class MembershipsRepository {
  constructor(private db: DatabaseService) {}

  async createMemberships(
    client:PoolClient,
    organization_id:string,
    user_id:string,
    role:string,
  ):Promise<ResCreateMembership> {
   const result = await client.query(
      `
      INSERT INTO memberships (id, organization_id, user_id, role)
      VALUES (gen_random_uuid(), $1, $2, $3)
      RETURNING id, organization_id, user_id, role
      `,
      [organization_id, user_id, role]
    );

    return result.rows[0];
  }
}