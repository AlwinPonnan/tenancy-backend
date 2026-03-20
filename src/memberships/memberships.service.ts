import { Injectable, NotFoundException } from '@nestjs/common';
import { MembershipsRepository } from './memberships.repository';

@Injectable()
export class MembershipsService {
  constructor(private readonly membershipsRepository: MembershipsRepository) {}

  async findOneOrgbyIdAndUserId(org_id: string, user_id: string) {
    let result = await this.membershipsRepository.getMembershipByOrgIdAndUserId(
      org_id,
      user_id,
    );

    if (!result) {
      throw new NotFoundException('Membership not found');
    }
    return result;
  }


    async CheckMembershipByOrgIdAndUserId(org_id: string, user_id: string) {
    let result = await this.membershipsRepository.CheckMembershipByOrgIdAndUserId(
      org_id,
      user_id,
    );

    return result;
  }
}
