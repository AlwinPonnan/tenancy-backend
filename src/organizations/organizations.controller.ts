import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { OrganizationsService } from './organizations.service';
import { TenantGuard } from 'src/common/guards/tenant.guard';

@Controller('organization')
export class OrganizationsController {
    constructor(private readonly organizationService:OrganizationsService){}

      @UseGuards(AccessTokenGuard)
      @Post('create')
      async refresh(@Req() req) {
        return this.organizationService.createOrganization(
          req.body.name,
          req.user.userId,
        );
      }

     @UseGuards(AccessTokenGuard, TenantGuard)
      @Get('findByOrgIdAndUserId/:orgId')
      async findOneOrgbyIdAndUserId(@Req() req) {
        return this.organizationService.findOneOrgbyIdAndUserId(
          req.context.orgId,
          req.user.userId,
        );
      }
    
}
