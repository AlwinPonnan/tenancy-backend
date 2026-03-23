import { Injectable, NotFoundException } from '@nestjs/common';
import { MembershipsRepository } from './memberships.repository';

@Injectable()
export class MembershipsService {
  constructor(private readonly membershipsRepository: MembershipsRepository) {}

  async findOneOrgbyIdAnduser_id(org_id: string, user_id: string) {
    let result = await this.membershipsRepository.getMembershipByOrgIdAnduser_id(
      org_id,
      user_id,
    );

    if (!result) {
      throw new NotFoundException('Membership not found');
    }
    return result;
  }


    async CheckMembershipByOrgIdAnduser_id(org_id: string, user_id: string) {
    let result = await this.membershipsRepository.CheckMembershipByOrgIdAnduser_id(
      org_id,
      user_id,
    );

    return result;
  }
}
