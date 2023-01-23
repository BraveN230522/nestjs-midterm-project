import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import moment from 'moment';

export function IsDateGreaterThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = args.object[relatedPropertyName];

          const endDate = moment(value, 'YYYY-MM-DD');
          const startDate = moment(relatedValue, 'YYYY-MM-DD');
          const diffTime = moment(endDate).diff(startDate);

          return diffTime === 0 || diffTime > 0;
        },
      },
    });
  };
}
