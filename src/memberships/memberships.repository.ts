import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from 'src/database/database.service';
import {
  ResCreateMembership,
  ResGetMembershipByOrgAndUser,
} from './types/membership.type';

@Injectable()
export class MembershipsRepository {
  constructor(private db: DatabaseService) {}

  async createMembership(
    client: PoolClient,
    organization_id: string,
    user_id: string,
    role: string,
  ): Promise<ResCreateMembership> {
    const result = await client.query(
      `
      INSERT INTO memberships (id, organization_id, user_id, role)
      VALUES (gen_random_uuid(), $1, $2, $3)
      RETURNING id, organization_id, user_id, role
      `,
      [organization_id, user_id, role],
    );

    return result.rows[0];
  }

  async validateMembershipAccess(
    organization_id: string,
    user_id: string,
  ): Promise<ResGetMembershipByOrgAndUser> {
    const result = await this.db.query(
      `
        SELECT 
            m.id,
            m.organization_id,
            m.user_id,
            m.role
        FROM memberships m
        INNER JOIN organizations o 
            ON m.organization_id = o.id
        WHERE m.organization_id = $1
          AND m.user_id = $2
          AND m.deleted_at IS NULL
          AND o.deleted_at IS NULL;
      `,
      [organization_id, user_id],
    );

    return result.rows[0];
  }

  async getMembershipByOrgIdAnduser_id(
    organization_id:string,
    user_id:string,
  ):Promise<ResGetMembershipByOrgAndUser> {
   const result = await this.db.query(
      `
        SELECT id,organization_id,user_id,role from memberships m 
        WHERE m.organization_id = $1 
        AND m.user_id = $2 
        AND deleted_at IS null;
      `,
      [organization_id, user_id]
    );

    return result.rows[0];
  }
  
  async CheckMembershipByOrgIdAnduser_id(
    organization_id: string,
    user_id: string,
  ): Promise<{ exists: Boolean }> {
    const result = await this.db.query(
      `
        SELECT exists (
	 SELECT 1 from memberships m 
	 where m.organization_id = $2
	 and m.user_id = $1
	 and m.deleted_at IS null 
)
      `,
      [organization_id, user_id],
    );

    return result.rows[0];
  }
}
