import { ServiceErrorParams } from '../interfaces';

export class ServiceError extends Error {
  public code: string;

  constructor({ message, code }: ServiceErrorParams) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
  }

  static create(message: string, code: string): ServiceError {
    return new ServiceError({ message, code });
  }
}