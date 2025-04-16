
export class ServiceError extends Error {
  code: string;
  
  constructor({ message, code }: { message: string; code: string }) {
    super(message);
    this.code = code;
    this.name = 'ServiceError';
  }

  static create(message: string, code: string): ServiceError {
    return new ServiceError({ message, code });
  }
}