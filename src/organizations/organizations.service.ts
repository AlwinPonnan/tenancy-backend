import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { generateSlug } from 'src/common/utils/slug.util';
import { DatabaseService } from 'src/database/database.service';
import { MembershipsRepository } from 'src/memberships/memberships.repository';
import { OrganizationsRepository } from './organizations.repository';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class OrganizationsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly db: DatabaseService,
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly membershipsRepository: MembershipsRepository,
  ) {}

  async createOrganization(name: string, user_id: string) {
    const normalizedName = name?.trim();

    if (!normalizedName || normalizedName.length < 3) {
      throw new BadRequestException('Invalid organization name');
    }

    let slug = generateSlug(normalizedName);
    const retryCount =
      this.configService.getOrThrow<number>('retry.RETRY_COUNT');

    for (let i = 0; i < retryCount; i++) {
      try {
        let result = await this.db.transaction(async (client) => {
          const org = await this.organizationsRepository.createOrganization(
            client,
            normalizedName,
            slug,
          );
          const membership = await this.membershipsRepository.createMembership(
            client,
            org.id,
            user_id,
            'OWNER',
          );

          return { id: org.id, name: org.name };
        });
        return result;
      } catch (error) {
        if (
          error.code === '23505' &&
          error.constraint === 'organizations_slug_key'
        ) {
          console.warn(`Slug collision for "${slug}" attempt ${i + 1}`);
          slug = generateSlug(normalizedName);
          // console.error(error, "error")
        } else {
          throw error;
        }
      }
    }

    throw new ConflictException('Could not generate unique organization slug');
  }

  async findOrgsByuser_id(user_id: string) {

    let result = await this.organizationsRepository.findOrgsByuser_id(user_id);
    if (!result || result.length == 0) {
      throw new NotFoundException('Organization not found');
    }
    return result;
  }

  async findOneOrgbyIdAnduser_id(org_id: string, user_id: string) {
    let result = await this.organizationsRepository.findOneOrgbyIdAnduser_id(
      org_id,
      user_id,
    );

    if (!result) {
      throw new NotFoundException('Organization not found');
    }
    return result;
  }
}
