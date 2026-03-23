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
          req.user.user_id,
        );
      }

     @UseGuards(AccessTokenGuard, TenantGuard)
      @Get('findByOrgIdAndUserId')
      async findOneOrgbyIdAnduser_id(@Req() req) {
        return this.organizationService.findOneOrgbyIdAnduser_id(
          req.context.organization_id,
          req.user.user_id,
        );
      }
    
}
