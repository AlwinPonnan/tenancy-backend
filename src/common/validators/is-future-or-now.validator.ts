import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isFutureOrNow', async: false })
export class IsFutureOrNowConstraint
  implements ValidatorConstraintInterface
{
  validate(value: Date, _args: ValidationArguments) {
    if (!value) return false;

    const now = new Date();
    now.setHours(0,0,0,0)
    console.log(value, "value",now, "now")
    return value >= now;
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Due Date must be greater than or equal to current time';
  }
}