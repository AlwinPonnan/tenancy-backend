import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { MembershipsRepository } from 'src/memberships/memberships.repository';
import { validate as isUUID } from 'uuid';
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly membershipRepository: MembershipsRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const orgId = request.params?.orgId;
    const userId = request.user?.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }

    if (!isUUID(orgId)) {
      throw new BadRequestException('Invalid organization id');
    }


    let exists = await this.membershipRepository.getMembershipByOrgIdAndUserId(
      orgId,
      userId,
    );

    if (!exists) {
      throw new ForbiddenException('Access denied');
    }


    request.context = {
      ...(request.context || {}),
      userId,
      orgId,
      role:exists.role
    };

    return true;
  }
}
