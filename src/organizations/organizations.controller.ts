import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { OrganizationsService } from './organizations.service';

@Controller('organization')
export class OrganizationsController {
    constructor(private readonly organizationService:OrganizationsService){}

      @UseGuards(AccessTokenGuard)
      @Post('create')
      async refresh(@Req() req) {
        return this.organizationService.createOrganizations(
          req.body.name,
          req.user.userId,
        );
      }
    
}
