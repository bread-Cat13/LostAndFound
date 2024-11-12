import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsStrongPasswordConstraint
  implements ValidatorConstraintInterface
{
  validate(password: string) {
    // 최소 길이, 대문자, 숫자, 특수문자 확인
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  defaultMessage() {
    return '비밀번호는 최소 8자 이상이며, 대문자, 숫자 및 특수문자를 포함해야 합니다.';
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsStrongPasswordConstraint,
    });
  };
}
