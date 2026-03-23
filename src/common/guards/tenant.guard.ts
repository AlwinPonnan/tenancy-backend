import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { MembershipsRepository } from 'src/memberships/memberships.repository';
import { validate as isUUID } from 'uuid';
import { RequestWithOrgAndUser } from '../types/request-with-org';
import { RequestWithUser } from '../types/request-with-user';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly membershipRepository: MembershipsRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const rawOrgId = request.headers['x-org-id'];

    if (typeof rawOrgId !== 'string' || !isUUID(rawOrgId)) {
      throw new ForbiddenException('Access denied');
    }

    if (!request.user || !request.user.user_id) {
      throw new UnauthorizedException();
    }

    const { user_id } = request.user;
    const organization_id = rawOrgId;

    const membership =
      await this.membershipRepository.validateMembershipAccess(
        organization_id,
        user_id,
      );

    if (!membership) {
      throw new ForbiddenException('Access denied');
    }

    (request as RequestWithOrgAndUser).context = Object.freeze({
      user_id,
      organization_id,
      role: membership.role,
    });

    return true;
  }
}