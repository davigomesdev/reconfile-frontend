import type { ApiErrorTypeEnum } from '../enums/api-error-type.enum';

export interface ApiErrorProps {
  code: number;
  type: ApiErrorTypeEnum;
  messages: string[];
}

export class ApiError extends Error {
  public error: ApiErrorProps;

  constructor(error: ApiErrorProps) {
    super(error.messages[0]);
    this.error = error;
  }
}
