import { Injectable } from '@nestjs/common';
import { generateSlug } from 'src/common/utils/slug.util';
import { DatabaseService } from 'src/database/database.service';
import { MembershipsRepository } from 'src/memberships/memberships.repository';
import { OrganizationsRepository } from './organizations.repository';
@Injectable()
export class OrganizationsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly membershipsRepository: MembershipsRepository,
  ) {}

  async createOrganizations(name: string, user_id: string) {
    const slug = generateSlug(name);
    await this.db.transaction(async (client) => {
      const org = await this.organizationsRepository.createOrganizations(
        client,
        name,
        slug,
      );

     const membership = await this.membershipsRepository.createMemberships(
        client,
        org.id,
        user_id,
        'OWNER',
      );


      
    });
  }
}
