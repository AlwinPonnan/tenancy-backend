import { Type } from 'class-transformer';
import {
    IsDate,
    IsEnum,
    IsOptional,
    IsString,
    Validate
} from 'class-validator';
import type { ProjectPriority } from '../types/projects.type';
import { PROJECT_PRIORITY } from '../types/projects.type';
import { IsFutureOrNowConstraint } from 'src/common/validators/is-future-or-now.validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Validate(IsFutureOrNowConstraint)
  due_date: Date;

  @IsOptional()
  @IsEnum(PROJECT_PRIORITY)
  priority: ProjectPriority;
}
